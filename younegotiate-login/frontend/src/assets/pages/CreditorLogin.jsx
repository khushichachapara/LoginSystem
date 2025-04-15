const CreditorLogin = () => {
  return (
    <div>
      <h1>Creditor Login</h1>
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};
export default CreditorLogin;
