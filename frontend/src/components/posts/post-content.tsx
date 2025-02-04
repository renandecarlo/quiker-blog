"use client"

import { Box } from "@mui/material"
import parse from "html-react-parser"
import truncateHtml from "truncate-html"
import styles from "./post-content.module.css"

interface PostContentProps {
    content: string
    preview?: boolean
    maxLength?: number
}

export function PostContent({ content, preview = false, maxLength = 300 }: PostContentProps) {
    // Se for preview, trunca o conteúdo mantendo as tags HTML intactas
    const truncatedContent = preview
        ? truncateHtml(content, maxLength, {
              keepWhitespaces: true,
              stripTags: false,
              ellipsis: "...",
          })
        : content

    // Garante que o conteúdo seja sempre uma string válida
    const displayContent = typeof truncatedContent === "string" ? truncatedContent : content

    return <Box className={styles.content}>{parse(displayContent)}</Box>
}
