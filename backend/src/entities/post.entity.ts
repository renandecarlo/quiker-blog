import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Comment } from "./comment.entity"
import { PostHistory } from "./post-history.entity"
import { PostInteraction } from "./post-interaction.entity"

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column("text")
    content: string

    @Column({ name: "cover_image", nullable: true })
    coverImage?: string

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date

    @Column({ name: "user_id" })
    userId: number

    @Column({ name: "view_count", default: 0 })
    viewCount: number

    @Column({ name: "like_count", default: 0 })
    likeCount: number

    @Column({ name: "dislike_count", default: 0 })
    dislikeCount: number

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "user_id" })
    user: User

    @OneToMany(() => Comment, (comment) => comment.post, {
        onDelete: "CASCADE",
    })
    comments: Comment[]

    @OneToMany(() => PostHistory, (history) => history.post, {
        cascade: true,
        onDelete: "CASCADE",
    })
    history: PostHistory[]

    @OneToMany(() => PostInteraction, (interatction) => interatction.post, {
        onDelete: "CASCADE",
    })
    interactions: PostInteraction[]
}
