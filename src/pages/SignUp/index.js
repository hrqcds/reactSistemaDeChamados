import {useState, useContext} from "react"
import {Link} from "react-router-dom"
import {AuthContext} from "../../contexts/auth"
import {toast} from "react-toastify"
import logo from "../../assets/logo.png"

function SignUp() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nome, setNome] = useState("")

    const {signUp, loadingAuth} = useContext(AuthContext)

    function handleSubmit(e){
      e.preventDefault()
      const erros = []

      if(nome === "") erros.push("Insira o nome")

      if(email === "") erros.push("Insira o email")

      if(password === "") erros.push("Insira a senha")

      if(erros.length > 0){
        for(let item of erros){
          toast.info(item)
        }

        return
      }

      signUp(email, password, nome)

    }

  return (
      <div className="container-center">
        <div className="login">
          <div className="logo-area">
            <img src={logo} alt="Logo do site"/>
          </div>

          <form onSubmit={handleSubmit}>
            <h1>Cadastrar uma conta</h1>
            <input type="text" placeholder="Insira seu Nome" value={nome} onChange={(e)=>setNome(e.target.value)}/>
            <input type="text" placeholder="Insira seu Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Insira sua Senha" value={password} onChange={(e)=>setPassword(e.target.value)} />            
            <button type="submit" >{loadingAuth ? "Carregando..." : "Cadastrar"}</button>
          </form>

          <Link to="/">Já tem uma conta? Faça login</Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;
  