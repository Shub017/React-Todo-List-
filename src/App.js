import styles from './App.module.css'
import { useContext, useEffect } from 'react';
import { CustomContext } from './CustomContext/customContext';

function App() {

  const {arecotentsFetched, Fetchedcontents, fetchItemsOfList, addNewResource, setTitle, setContent, title, content, titleInputRef, delteItem, updateItem, isModalOpen, setIsModalOpen, selectedItem, setSelectedItem, setId} = useContext(CustomContext);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchItemsOfList();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
    
  }, []);

  const submitForm = async (event)=>{
    event.preventDefault();
    await addNewResource()
    setTitle((preval)=> '');
    setContent((preval)=> '');
    setId((preval)=> preval+1);
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (item) => {
    console.log('handle Updated clicked', item);
    setSelectedItem(item);
    setTitle(item.title);
    setContent(item.body);
    openModal();
  };

  const submitUpadteForm = async (event) =>{
    event.preventDefault();
    await updateItem({id:selectedItem.id, userId:selectedItem.userId});
    setSelectedItem(null);
    setTitle('');
    setContent('');
    closeModal();
    } 
  
  

  return (
    <>
    <div className={`${styles.ListContainer} `}>
      <span className={styles.heading}>𝕿𝖔𝖉𝖔𝕷𝖎𝖘𝖙</span>

      <div className={`${styles.Form}`} >
        <form id="commentForm" className={styles.formBorder} onSubmit={submitForm}>
          <div>
              <label for="title" className={styles.FormTitle}>Title :</label>
              <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.formTitleInput} ref={titleInputRef}/>
          </div>
          <div>
              <label for="content" className={styles.formContentLabel}>Content :</label>
              <textarea id="content" name="content" rows="4" value={content} onChange = {(e)=>setContent(e.target.value)} required className={styles.formContentInput}></textarea>
          </div>
          <button type="submit" className={`${styles.customBtn} ${styles.btn16}`} >Submit</button>
        </form>
      </div>

      {/* Displaying fetched list */}
      {arecotentsFetched? Fetchedcontents.map((d)=>{
        return(<div className={styles.ListContainerContent} key={d.id}>
          <div className={styles.idUidContent}>
            <span className={styles.idUid}>Id: {d.id}</span>
            <span className={styles.idUid}>Uid: {d.userId}</span>
          </div>

          <p className={styles.listTitle}>Title: {d.title}</p>
          <div className={styles.listContent}>{d.body}</div>
          <div className={styles.buttonContainer}>
          <button class={`${styles.customBtn2} ${styles.btn12}`} onClick={()=> {delteItem({ id: d.id, userId: d.userId })}}><span>Click!</span><span>Delete</span></button> 
          <button class={`${styles.customBtn2} ${styles.btn13}`} onClick={()=> {handleUpdate(d)}}><span>Click!</span><span>Update</span></button> 
          </div>
        </div>)
      }):''}


      
    
    </div>
    

    {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <h2>Edit Item</h2>
            <form onSubmit={submitUpadteForm}>
              <label htmlFor="modal-title" className={styles.modalTitleLabel}>Title:</label>
              <input type="text" id="modal-title" value={title} className={styles.modalTitle} onChange={(e) => setTitle(e.target.value)} required />
              <label htmlFor="modal-content" className={styles.modalTitleLabel}>Content:</label>
              <textarea id="modal-content" value={content} className={styles.modalBody} onChange={(e) => setContent(e.target.value)} required />
              <button type="submit" className={styles.editSubmitButton}>Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
