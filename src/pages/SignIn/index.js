import {useState, useContext} from "react"
import {Link} from "react-router-dom"
import {AuthContext} from "../../contexts/auth"
import {toast} from "react-toastify"
import logo from "../../assets/logo.png"
import "./SignIn.css"

function SignIn() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {signIn, loadingAuth} = useContext(AuthContext)

    function handleSubmit(e){
      e.preventDefault()

      const listErros = []

      if(email === ""){
        listErros.push("Insira o email")
      } 
        
      if(password === ""){
        listErros.push("Insira uma senha ")
      }

      if(listErros.length > 0){
        for (let i of listErros){
          
            toast.info(`${i}`)
          
        }
        
        return
      }

      signIn(email, password)
    }

  return (
      <div className="container-center">
        <div className="login">
          <div className="logo-area">
            <img src={logo} alt="Logo do site"/>
          </div>

          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder="Insira seu Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Insira sua Senha" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit" >{loadingAuth ? "Carregando..." : "Acessar"}</button>
          </form>

          <Link to="/register">Criar uma conta</Link>
        </div>
      </div>
    );
  }
  
  export default SignIn;
  