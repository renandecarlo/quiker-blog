import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Exclude, Expose } from "class-transformer"
import { Post } from "./post.entity"
import { Comment } from "./comment.entity"

@Entity("users")
export class User {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number

    @Expose()
    @Column({ length: 100 })
    name: string

    @Exclude()
    @Column({ length: 191, unique: true })
    email: string

    @Exclude()
    @Column()
    password: string

    @Exclude()
    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date

    @Exclude()
    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date

    @Exclude()
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}
