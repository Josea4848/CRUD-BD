import { ILike, Repository } from "typeorm";
import { Seller } from "../entity/seller";

export class Seller_Manager {
  //----------------------------------------- CREATE ---------------------------------------------
  public async add(
    CPF: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    seller_table: Repository<Seller>
  ): Promise<Seller> {
    if (isCPFValid(CPF)) {
      const seller = new Seller(CPF, first_name, last_name, birthdate);
      await seller_table.save(seller);
      return seller;
    }
    return null;
  }

  //------------------------------------------ READ ---------------------------------------------
  public async getAll(seller_table: Repository<Seller>): Promise<Seller[]> {
    return await seller_table.find();
  }

  public async getOne(
    CPF: string,
    seller_table: Repository<Seller>
  ): Promise<Seller> {
    if (isCPFValid(CPF)) {
      return await seller_table.findOneBy({ CPF: CPF });
    }
    return null;
  }

  public async getByName(
    first_name: string,
    last_name: string,
    seller_table: Repository<Seller>
  ): Promise<Seller[]> {
    if (first_name == null) {
      return await seller_table.findBy({ last_name: ILike(`%${last_name}%`) });
    } else if (last_name == null) {
      return await seller_table.findBy({
        first_name: ILike(`%${first_name}%`),
      });
    } else {
      const sellers = await seller_table.findBy({
        first_name: ILike(`%${first_name}%`),
        last_name: ILike(`%${last_name}%`),
      });
      if (sellers == null) {
        return await seller_table.findBy({
          first_name: ILike(`%${first_name}%`),
        });
      } else {
        return sellers;
      }
    }
  }

  //--------------------------------------- UPDATE ---------------------------------------------
  public async updateName(
    CPF: string,
    new_first_name: string,
    new_last_name: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    if (new_first_name == null) {
      await seller_table.update(CPF, { last_name: new_last_name });
    } else if (new_last_name == null) {
      await seller_table.update(CPF, { first_name: new_first_name });
    } else {
      await seller_table.update(CPF, {
        first_name: new_first_name,
        last_name: new_last_name,
      });
    }
  }

  public async updateBirthdate(
    CPF: string,
    date: string,
    seller_table: Repository<Seller>
  ): Promise<void> {
    if (isCPFValid(CPF)) {
      await seller_table.update(CPF, { birthdate: date });
    }
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
    if (isCPFValid(CPF)) {
      const seller = await this.getOne(CPF, seller_table);
      await seller_table.remove(seller);
    }
  }
}

//--------------------------------------- checks --------------------------------------------
export function isCPFValid(CPF: string): boolean {
  if (CPF.length != 11) {
    throw new Error("Not a valid CPF");
    return false;
  }

  if (!/^\d{11}$/.test(CPF)) {
    throw new Error("Not a valid CPF");
    return false;
  }
  return true;
}
