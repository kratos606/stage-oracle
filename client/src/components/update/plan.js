import React,{useState} from 'react'
import {Alert,TextField,Button,Dialog,DialogTitle,DialogActions,DialogContent} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Plan(props) {
  const [selected,setSelected]=useState(props.plan)
    const [error,setError]=useState(null)
    const navigate = useNavigate();
    const handleClose = () => {
        props.setOpen(false);
    }
    const handleUpdate = async() => {
        await axios.put(`http://localhost:5000/plan/${selected.id}`,{code_rlp:selected.code_rlp,ordre_jour:selected.ordre_jour,ordre_lecture_paquet:selected.ordre_lecture_paquet,tournée_debut:selected.tournée_debut,tournée_fin:selected.tournée_fin}).then(res => {     
            if(res.data.error) {
                setError(res.data.error);
            } else {
                window.localStorage.setItem('success',res.data.success);
                props.setOpen(false);
                navigate(0);
            }
        }).catch(err => {
            setError(err.message);
        });
    }
  return (
    <>
        <Dialog
            open={props.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {'Update Plan'}
        </DialogTitle>
        <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="cod RLP"
          type="text"
          fullWidth
          variant="standard"
          value={selected && selected.code_rlp}
          onChange={(e)=>{setSelected({...selected,code_rlp:e.target.value})}}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="ordre jour"
          type="text"
          fullWidth
          value={selected && selected.ordre_jour}
          variant="standard"
          onChange={(e)=>{setSelected({...selected,ordre_jour:e.target.value})}}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="ordre lecture paquet"
          type="text"
          fullWidth
          value={selected && selected.ordre_lecture_paquet}
          variant="standard"
          onChange={(e)=>{setSelected({...selected,ordre_lecture_paquet:e.target.value})}}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="tournée debut"
          type="text"
          fullWidth
          value={selected && selected.tournée_debut}
          variant="standard"
          onChange={(e)=>{setSelected({...selected,tournée_debut:e.target.value})}}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="tournée fin"
          type="text"
          fullWidth
          value={selected && selected.tournée_fin}
          variant="standard"
          onChange={(e)=>{setSelected({...selected,tournée_fin:e.target.value})}}
        />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleUpdate} autoFocus>
            Update
            </Button>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
        </Dialog>
    </>
  )
}

export default Plan