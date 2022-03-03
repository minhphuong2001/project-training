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
        PaperProps={{ style: { backgroundColor: '#323259', padding: '15px', color: '#fff' } }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
  )
}