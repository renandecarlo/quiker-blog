import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm"
import { Post } from "./post.entity"

@Entity("post_history")
export class PostHistory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "post_id" })
    postId: number

    @Column("text")
    title: string

    @Column("text")
    content: string

    @ManyToOne(() => Post, (post) => post.history, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date
}
