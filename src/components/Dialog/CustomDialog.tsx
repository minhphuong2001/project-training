import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material'

interface CustomDialogProps {
  title: string;
  open: boolean;
  content?: React.ReactNode;
  actions: React.ReactNode;
}

export function CustomDialog({ title, open, content, actions }: CustomDialogProps) {
    
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          backgroundColor: '#323259',
          color: '#fff',
          padding: '10px',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #1b1b38'}}>{title}</DialogTitle>
      <DialogContent sx={{ borderBottom: '1px solid #1b1b38', margin: '10px 0'}}>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  )
}