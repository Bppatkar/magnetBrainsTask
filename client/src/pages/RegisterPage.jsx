import UserAuth from '../components/UserAuth.jsx';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <UserAuth isRegister={true} />
    </div>
  );
};

export default RegisterPage;
