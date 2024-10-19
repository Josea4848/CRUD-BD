import { ILike, Repository } from "typeorm";
import { Seller } from "../entity/seller";
import * as bcrypt from "bcrypt";

export class Seller_Manager {
  //----------------------------------------- CREATE ---------------------------------------------
  public async add(
    CPF: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    password: string,
    seller_table: Repository<Seller>
  ): Promise<Seller> {
    if (isCPFValid(CPF)) {
      const hashedPassword = await this.hashPassword(password); // Criptografa a senha

      const seller = new Seller(
        CPF,
        first_name,
        last_name,
        birthdate,
        hashedPassword
      );
      await seller_table.save(seller);
      return seller;
    }
    return null;
  }

  //------------------------------------------ LOGIN ---------------------------------------------
  public async login(
    CPF: string,
    password: string,
    seller_table: Repository<Seller>
  ): Promise<Seller> {
    const seller = await seller_table.findOne({ where: { CPF } });

    if (!seller) throw new Error("Usuário não encontrado");

    const isPasswordValid = await this.comparePassword(
      password,
      seller.password
    );
    if (!isPasswordValid) throw new Error("Senha incorreta");

    return seller;
  }

  //--------------------------------------- READ ---------------------------------------------
  public async getAll(seller_table: Repository<Seller>): Promise<Seller[]> {
    return await seller_table.find();
  }

  public async getOne(
    CPF: string,
    seller_table: Repository<Seller>
  ): Promise<Seller | null> {
    if (isCPFValid(CPF)) {
      return await seller_table.findOneBy({ CPF });
    }
    return null;
  }

  public async getByName(
    first_name: string,
    last_name: string,
    seller_table: Repository<Seller>
  ): Promise<Seller[]> {
    const query = {
      first_name: ILike(`%${first_name || ""}%`),
      last_name: ILike(`%${last_name || ""}%`),
    };
    return await seller_table.findBy(query);
  }

  //--------------------------------------- UPDATE ---------------------------------------------
  public async updateName(
    CPF: string,
    new_first_name: string,
    new_last_name: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    await seller_table.update(CPF, {
      first_name: new_first_name || undefined,
      last_name: new_last_name || undefined,
    });
  }

  public async updateBirthdate(
    CPF: string,
    newBirthdate: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    await seller_table.update(CPF, { birthdate: newBirthdate });
  }

  public async updatePassword(
    CPF: string,
    newPassword: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    await seller_table.update(CPF, { password: hashedPassword });
  }

  //--------------------------------------- DELETE ---------------------------------------------
  public async removeOne(
    seller: Seller,
    seller_table: Repository<Seller>
  ): Promise<void> {
    await seller_table.remove(seller);
  }

  public async removeByCPF(
    CPF: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    const seller = await this.getOne(CPF, seller_table);
    if (seller) await seller_table.remove(seller);
  }

  //------------------------------------- PASSWORD HELPERS --------------------------------------
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

//--------------------------------------- checks --------------------------------------------
export function isCPFValid(CPF: string): boolean {
  if (CPF.length !== 11 || !/^\d{11}$/.test(CPF)) {
    throw new Error("CPF inválido");
  }
  return true;
}
