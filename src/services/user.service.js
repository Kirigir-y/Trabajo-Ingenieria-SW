import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function updateUser(id, updates) {
  // Buscar usuario
  const user = await userRepository.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");

  // Validar y hashear password si se proporciona
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  // Validar email único
  if (updates.email && updates.email !== user.email) {
    const existing = await userRepository.findOneBy({ email: updates.email });
    if (existing) throw new Error("Correo ya en uso por otro usuario");
  }

  // Aplicar solo los campos que el usuario envió
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) user[key] = updates[key];
  });

  return await userRepository.save(user);
}

/** Eliminar perfil privado del usuario */
export async function deleteUser(id) {
  const user = await userRepository.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");

  await userRepository.remove(user);
  return { message: "Cuenta eliminada correctamente" };
}