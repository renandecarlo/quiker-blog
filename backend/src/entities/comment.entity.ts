import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Post } from "./post.entity"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    content: string

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date

    @Column({ name: "user_id" })
    userId: number

    @Column({ name: "post_id" })
    postId: number

    @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
    deletedAt: Date | null

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post
}
