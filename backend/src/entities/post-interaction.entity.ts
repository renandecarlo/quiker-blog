import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Post } from "./post.entity"

@Entity("post_interactions")
export class PostInteraction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "post_id" })
    postId: number

    @Column({ name: "user_id", nullable: true })
    userId: number

    @Column({ name: "ip_address" })
    ipAddress: string

    @Column({ name: "has_viewed", default: false })
    hasViewed: boolean

    @Column({ name: "has_liked", default: false })
    hasLiked: boolean

    @Column({ name: "has_disliked", default: false })
    hasDisliked: boolean

    @ManyToOne(() => Post, (post) => post.interactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date
}
