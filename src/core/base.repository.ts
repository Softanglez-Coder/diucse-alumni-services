import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private _model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return await this._model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this._model.findById(id).exec();
  }

  async create(dto: Partial<T>): Promise<T> {
    const document = new this._model(dto);
    return await document.save();
  }

  async update(id: string, dto: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return await this._model.findByIdAndDelete(id).exec();
  }

  async findByProperty<PV>(property: string, value: PV): Promise<T | null> {
    return await this._model.findOne({
      [property]: value,
      } as unknown as Record<string, PV>)
      .exec();
  }
}