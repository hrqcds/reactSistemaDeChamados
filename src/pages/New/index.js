import {useState, useEffect, useContext} from "react"
import {toast} from "react-toastify"
import {AuthContext} from "../../contexts/auth"
import firebase from "../../services/firebaseConnection"
import { useHistory, useParams} from "react-router-dom"
import "./new.css"
import Title from "../../components/Title"
import Header from "../../components/Header"
import {FiPlus} from "react-icons/fi"


export default function New(){

    const {id} = useParams()
    const history = useHistory()
    const [idCustomer, setIdCustomer] = useState(false)

    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customersSelected, setCustomersSelected] = useState(0)

    const [assunto, setAssunto] = useState("Suporte")
    const [status, setStatus] = useState("Aberto")
    const [complemento, setComplemento] = useState("")

    const {user} = useContext(AuthContext)

    useEffect(()=>{
        async function loadCustomers(){
            firebase.firestore().collection("customers")
            .get()
            .then((snapshot)=>{
                let lista = []

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                    console.log("Nenhuma empresa encontrada")
                    setCustomers([{id: "1", nomeFantasia: "Freela"}])
                    setLoadCustomers(false)        
                    return           
                }

                setCustomers(lista)
                setLoadCustomers(false)

                if(id){
                    loadId(lista)
                }
            })
            .catch(e=>{
                console.log("Deu algum erro ", e)
                setCustomers([{id: "1", nomeFantasia: ""}])
                setLoadCustomers(false) 
            }) 
        }

        loadCustomers()
    }, [id])

    async function loadId(lista){
        await firebase.firestore().collection("chamados").doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomersSelected(index)
            setIdCustomer(true)
        })
        .catch(e=>{
            console.log(e)
            setIdCustomer(false)
        }) 
    }

    async function handleRegister(e){
        e.preventDefault()

        if(idCustomer){
            await firebase.firestore().collection("chamados").doc(id)
            .update({
                cliente: customers[customersSelected].nomeFantasia,
                clienteId: customers[customersSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid 
            })
            .then(()=>{
                toast.success("Dados atualizados com sucesso")
                setCustomersSelected(0)
                setComplemento("")
                history.push("/dashboard")            
            })
            .catch(e=>{
                toast.error("Ops erro ao atualizar os dados, tente mais tarde")
                console.log(e)
            })
            return
        }

        await firebase.firestore().collection("chamados")
        .add({
            created: new Date(),
            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid 
        })
        .then(()=>{
            toast.success("Chamado criado com sucesso")
            setComplemento("")
            setCustomersSelected(0)
        })
        .catch(e=>{
            toast.error("Ops... erro ao registrar, tente mais tarde")
            console.log(e)
        })
    }

    // Chama quando troca o assunto
    function handleSelectChange(e){
        setAssunto(e.target.value)    
    }

    // Chama quando troca o status
    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    // chama quando troca de clientes
    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value)
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title nome="Novo chamado">
                    <FiPlus size={25}/>
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleRegister}>
                        
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..."/>
                        
                            ) : (

                            <select value={customersSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index)=>{
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>                            
                        )}                        

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelectChange}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                            <div className="status">
                                <input type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={ status === "Aberto" }
                                />
                                <span>Em Aberto</span>                        
                            
                                <input type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}   
                                checked={ status === "Progresso" }
                             
                                />
                                <span>Em Progresso</span>                        
                            
                                <input type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={ status === "Atendido" }
                                />
                                <span>Atendido</span>
                            </div>

                        <label>Complemento</label>
                        <textarea type="text"
                        placeholder="Descreva seu problema (opcional)"
                        value={complemento}
                        onChange={(e)=>setComplemento(e.target.value)}
                        />
                   
                        <button type="submit">Registrar</button>
                   
                    </form>

                </div>

            </div>
        </div>
    )
}