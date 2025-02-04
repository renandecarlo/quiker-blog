import { PostHistory as PostHistoryType } from "@/types/post"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import { Box, Typography, useTheme, Fade } from "@mui/material"
import parse from "html-react-parser"

interface PostHistoryProps {
    history: PostHistoryType[]
}

export function PostHistory({ history }: PostHistoryProps) {
    const theme = useTheme()
    if (!history?.length) return null

    return (
        <Box sx={{ my: 4 }}>
            <Typography
                variant="h5"
                component="h2"
                sx={{
                    mb: 3,
                    textAlign: "center",
                    color: "text.primary",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                }}
            >
                Histórico de Edições
            </Typography>

            <Timeline position="alternate" sx={{ p: 0 }}>
                {history.map((item, index) => (
                    <Fade key={item.id} in={true} timeout={500 + index * 100}>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: `0 0 0 4px ${theme.palette.primary.light}`,
                                    }}
                                />
                                {index < history.length - 1 && (
                                    <TimelineConnector
                                        sx={{
                                            backgroundColor: theme.palette.primary.light,
                                            width: "2px",
                                        }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: "12px", px: 2 }}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: theme.shadows[1],
                                        transition: "box-shadow 0.3s",
                                        "&:hover": {
                                            boxShadow: theme.shadows[3],
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            mb: 0.5,
                                            display: "block",
                                        }}
                                    >
                                        {formatDistanceToNow(new Date(item.createdAt), {
                                            addSuffix: true,
                                            locale: ptBR,
                                        })}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: "text.primary",
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {parse(item.content)}
                                    </Typography>
                                </Box>
                            </TimelineContent>
                        </TimelineItem>
                    </Fade>
                ))}
            </Timeline>
        </Box>
    )
}
