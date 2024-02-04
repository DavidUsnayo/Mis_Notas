import {db} from '../firebase'
import {useEffect, useRef, useState} from 'react'
import { addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, query} from 'firebase/firestore'
import './link.css'

export function MisNotas(){
    let titulo = useRef()
    let des = useRef()
    let modal = useRef()
    let ver = useRef()
    let box = useRef()
    let [estado, setEstado] = useState({status:false, id:null})
    let [cambio, setCambio] = useState('Guardar')
    let [fondo, setFondo] = useState('red')
    let [tareas, setTareas] = useState([])

    function agregar(sub,texto){
        addDoc(collection(db,'notas'),{titulo:sub, descripcion:texto, fecha:serverTimestamp()})
    }

    function mostrar(callback){
        let q = query(collection(db,'notas'),orderBy("fecha", "desc"))
        return onSnapshot(q,callback)
    }

    useEffect(() => {
        mostrar((query) => {
            const array = [];
            query.forEach((doc) => {
                array.push({ 
                    id: doc.id, 
                    tar: doc.data().titulo, 
                    info: doc.data().descripcion });
            });
            setTareas(array);
        });
    }, []);
    
    function borrar(id,valor){
        deleteDoc(doc(db,'notas',id))
        localStorage.setItem('data',valor) //guardar en el localStorage
    }

    function editar(id, actual){
        updateDoc(doc(db,'notas',id),actual)
    }

    function botonGuardarActualizar(){
        modal.current.close()
        if(titulo.current.value == '' && des.current.value == ''){
        }else{
            if(estado.status == false){
                agregar(titulo.current.value, des.current.value)
                
            }else{
                editar(estado.id,{titulo:titulo.current.value, descripcion:des.current.value, fecha:serverTimestamp()})
                setEstado({status:false, id:null})
                setCambio('Agregar')
                setFondo('red')
            }  
            titulo.current.value = ''
            des.current.value = ''
        }
    }

    function verNota(title,info){
        ver.current.style.display='block'
        ver.current.children[1].textContent = title
        ver.current.children[2].textContent = info
        console.log(ver.current.children[1])
    }
    function actualizarNota(tarea,info,id){
        modal.current.showModal()
        titulo.current.value= tarea
        des.current.value = info
        setEstado({status:true, id:id})
        setCambio('Actualizar')
        setFondo('rgb(0, 174, 148)')
    }

    function abrir(e){
        e.stopPropagation()
        let b = e.target.parentNode.parentNode.querySelectorAll('.botones')
        b.forEach(btn => btn.style.right='0px')
        setTimeout(()=>{
            b.forEach(btn => btn.style.right='-100px')
        },3500)
    }
    function cerrar(){
        let btn = box.current.querySelectorAll('.botones')
        btn.forEach(b => b.style.right = '-100px')
    }
    return(
        <div className='container'>
            <div className="agregar" onClick={() => modal.current.showModal() }>
                <p>AGREGAR</p>
            </div>
            <div className='box-tareas' ref={box} onClick={(e)=> cerrar()} onTouchStart={()=>cerrar()}>
                {tareas.map((e,i) => {
                    return(
                        <div key={i} className='tarea' onDoubleClick={()=> verNota(e.tar, e.info)}>
                            <div className='nota' >
                                <h3> {e.tar} </h3>
                                <p> {e.info} </p>
                                <span onClick={(e)=>abrir(e)}>...</span>
                            </div>
                            <div className='botones' style={{right:'-100px'}}>
                                <button onClick={()=> actualizarNota(e.tar, e.info, e.id)}>Editar</button>
                                <button onClick={() => borrar(e.id,e.info)} >Borrar</button>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
            <dialog className="modal" ref={modal}>
                <input type="text" placeholder='Titulo' ref={titulo}/>
                <textarea cols="30" rows="20" placeholder='Descripcion' ref={des}></textarea>
                <button style={{background:fondo}} onClick={()=> botonGuardarActualizar()}> {cambio} </button>
            </dialog>
            <div className="ver" ref={ver}>
                <h2 onClick={()=>ver.current.style.display='none'}>←</h2>
                <h3></h3>
                <p></p>
            </div>
            <button className='get' onClick={()=> alert(localStorage.getItem('data'))} >○</button>
        </div>
    )
}