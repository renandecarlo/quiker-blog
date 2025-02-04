"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"
import { Box, IconButton, Paper, Tooltip } from "@mui/material"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"

interface BasicEditorProps {
    value: string
    onChange: (content: string) => void
    placeholder?: string
}

export function BasicEditor({ value, onChange, placeholder = "Digite seu texto aqui..." }: BasicEditorProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                style: "min-height: 100px; padding: 1rem; outline: none;",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editable: true,
        autofocus: false,
        immediatelyRender: false,
    })

    if (!isMounted) {
        return <Paper sx={{ height: "120px", bgcolor: "grey.100" }} />
    }

    if (!editor) {
        return <Box>Carregando editor...</Box>
    }

    return (
        <Paper variant="outlined">
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "grey.50",
                    p: 0.5,
                    display: "flex",
                    gap: 0.5,
                    borderRadius: "12px 12px 0 0",
                }}
            >
                <Tooltip title="Negrito (Ctrl+B)">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        color={editor.isActive("bold") ? "primary" : "default"}
                    >
                        <FormatBoldIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Itálico (Ctrl+I)">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        color={editor.isActive("italic") ? "primary" : "default"}
                    >
                        <FormatItalicIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <EditorContent editor={editor} placeholder={placeholder} />
        </Paper>
    )
}
