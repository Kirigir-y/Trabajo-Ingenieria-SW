import { handleSuccess, handleErrorClient, handleErrorServer} from "../Handlers/responseHandlers.js";
import { updateUser, deleteUser } from "../services/user.service.js";


export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updatePrivateProfile(req, res) {
  const userId = req.user.id;
  const { email, password } = req.body;

  try {
    const updates = {};

    if (email) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmail.test(email)) {
        return handleErrorClient(res, 400, "Email inválido, revise el formato");
      }
      updates.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return handleErrorClient(res, 400, "La contraseña debe ser mínimo de 6 caracteres");
      }
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      return handleErrorClient(res, 400, "No se proporcionó ningún dato para actualizar");
    }

    const updatedUser = await updateUser(userId, updates);

    const { password: _, ...userData } = updatedUser;

    return handleSuccess(res, 200, "Perfil modificado con éxito", { user: userData });

  } catch (err) {
    if (err.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "No se encontró el usuario");
    }
    if (err.message.includes("email")) {
      return handleErrorClient(res, 409, "El correo ya pertenece a otro usuario");
    }
    return handleErrorServer(res, 500, "Error al actualizar perfil", err.message);
  }
}

export async function deletePrivateProfile(req, res) {
  const userId = req.user.id;

  try {
    await deleteUser(userId);
    return handleSuccess(res, 200, "Cuenta eliminada correctamente", { message: "Su cuenta ha sido borrada de forma permanente" });
  } catch (err) {
    if (err.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    return handleErrorServer(res, 500, "Error al eliminar cuenta", err.message);
  }
}
