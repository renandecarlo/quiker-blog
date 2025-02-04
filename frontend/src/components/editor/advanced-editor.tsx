"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { useEffect, useState } from "react"
import { Box, IconButton, Paper, Tooltip, Divider } from "@mui/material"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS"
import CodeIcon from "@mui/icons-material/Code"
import TitleIcon from "@mui/icons-material/Title"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import LinkIcon from "@mui/icons-material/Link"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter"
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight"
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify"
import styles from "../posts/post-content.module.css"

interface AdvancedEditorProps {
    value: string
    onChange: (content: string) => void
    placeholder?: string
    disabled?: boolean
}

export function AdvancedEditor({
    value,
    onChange,
    placeholder = "Digite seu texto aqui...",
    disabled = false,
}: AdvancedEditorProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: "noopener noreferrer nofollow",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                style: "min-height: 200px; padding: 1rem; outline: none;",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editable: !disabled,
        autofocus: false,
        immediatelyRender: false,
    })

    const setLink = () => {
        const url = window.prompt("URL do link:")

        if (url === null) {
            return
        }

        if (url === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    if (!isMounted) {
        return <Paper sx={{ height: "200px", bgcolor: "grey.100" }} />
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
                    p: 1,
                    borderRadius: "12px 12px 0 0",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1,
                    }}
                >
                    {/* Primeira linha/coluna */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Tooltip title="Negrito (Ctrl+B)">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                color={editor.isActive("bold") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatBoldIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Itálico (Ctrl+I)">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                color={editor.isActive("italic") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatItalicIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Tachado">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                color={editor.isActive("strike") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <StrikethroughSIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Link">
                            <IconButton
                                size="small"
                                onClick={setLink}
                                color={editor.isActive("link") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <LinkIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Código">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleCode().run()}
                                color={editor.isActive("code") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <CodeIcon />
                            </IconButton>
                        </Tooltip>

                        <Divider orientation="vertical" flexItem />

                        <Tooltip title="Título">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                color={editor.isActive("heading", { level: 2 }) ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <TitleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Lista com Marcadores">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                color={editor.isActive("bulletList") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatListBulletedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Lista Numerada">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                color={editor.isActive("orderedList") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatListNumberedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Citação">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                color={editor.isActive("blockquote") ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatQuoteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Segunda linha/coluna */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Tooltip title="Alinhar à Esquerda">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                color={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatAlignLeftIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Centralizar">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                color={editor.isActive({ textAlign: "center" }) ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatAlignCenterIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Alinhar à Direita">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                color={editor.isActive({ textAlign: "right" }) ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatAlignRightIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Justificar">
                            <IconButton
                                size="small"
                                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                                color={editor.isActive({ textAlign: "justify" }) ? "primary" : "default"}
                                disabled={disabled}
                            >
                                <FormatAlignJustifyIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <EditorContent editor={editor} className={styles.content} />
        </Paper>
    )
}
