import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import './quill.scss'

interface EditDocumentProps {
    title: string;
    setTitle: (value: string) => void;
}

function EditDocument({ title, setTitle }: EditDocumentProps) {

    return (
        <div className='editor'>
            <ReactQuill
                placeholder='Enter text here...'
                modules={EditDocument.modules}
                formats={EditDocument.formats}
                value={title}
                onChange={setTitle}
                theme='snow'
                className='quillWrapper'
            />
        </div>
    )
}

EditDocument.modules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
        {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
}
   
EditDocument.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

export default EditDocument;