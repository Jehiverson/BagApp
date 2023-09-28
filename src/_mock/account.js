// Obtén el objeto de usuario del localStorage
const localStorageUser = JSON.parse(localStorage.getItem('user'));

// Construye el objeto de cuenta utilizando los valores del localStorage
const account = {
  displayName: localStorageUser ? localStorageUser.username : 'Nombre Predeterminado', // Cambia 'Nombre Predeterminado' por el valor predeterminado que desees
  email: localStorageUser ? localStorageUser.email : 'email@example.com', // Cambia 'email@example.com' por el valor predeterminado que desees
  photoURL: '/assets/images/avatars/avatar_2.jpg', // Cambia para la imagen del Perfil
  role: localStorageUser ? localStorageUser.role : 'Rol Predeterminado', // Cambia 'Rol Predeterminado' por el valor predeterminado que desees
};
// Exporta la funcion
export default account;
