import { createContext, useState, useRef, useCallback } from "react";



const CustomContext = createContext();

export default function CustomProviderContext({children}){

    const [arecotentsFetched, setAreContentsFetched] = useState(false);
    const [Fetchedcontents, setFetchedContents] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [id, setId] = useState(1);
    const titleInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchItemsOfList = useCallback(() => {
        try {
            fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then((json) => {
                setFetchedContents((prevVal)=>{
                    if(Array.isArray(json)){
                        return json;
                    }
                    else{
                        return [json];
                    }
                });
                setAreContentsFetched(true);
                console.log(json);
            });
        } catch(error) {
            console.log(error);
            setAreContentsFetched(false);
        }
    }, [setFetchedContents, setAreContentsFetched]);
    

    const addNewResource = async ()=>{
        if (title.trim() === '' || content.trim() === ''){
            console.log('Empty fields not allowed');
            return;
        }
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: content,
                userId: id,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        
        const newResource = await response.json();
        console.log(newResource); // Here you can access the data from the response
        setFetchedContents((prevVal)=>{return [ newResource, ...prevVal]});
    }

    const delteItem = async (props)=>{
        const {id, userId} = props;
        fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'DELETE',
        });

        
        
        const tempContent = Fetchedcontents.filter((d) => {
            console.log(`Checking ${d.id} ${d.userId} compared with ${id} ${userId}`)
            return d.id !== id || d.userId !== userId;
        });
        console.log('Contents after deletion', tempContent);
        setFetchedContents(()=> tempContent);
        
    }

    const updateItem = async ({id, userId})=> {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                title: title,
                body: content,
                userId: userId,
            }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            },
        })

        const newResource = await response.json();
        console.log(newResource);
        const newFetchedContent = Fetchedcontents.map((d)=>{
            if (d.id === id && d.userId === userId){
                return newResource;
            }
            else{
                return d;
            }
        })

        setFetchedContents(() => newFetchedContent);
    }


    return(
        <CustomContext.Provider value={{arecotentsFetched, Fetchedcontents, fetchItemsOfList, addNewResource, title, content, id, setTitle, setContent, titleInputRef, delteItem, updateItem, isModalOpen, setIsModalOpen, selectedItem, setSelectedItem, setId}}>
            {children}
        </CustomContext.Provider>
    )
}

export {CustomContext};