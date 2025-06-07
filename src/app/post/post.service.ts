import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/database/entities/Post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/database/entities/User.entity';
import { ClsService } from 'nestjs-cls';
import { FindOneParams, FindParams } from 'src/shared/types/find.params';
import { GetUserPostsDto } from './dto/user-posts.dto';

@Injectable()
export class PostService {
  constructor(
    private cls: ClsService,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
  ) {}

  find(params: FindParams<PostEntity>) {
    const { where, relations, select, limit, page, order } = params;

    return this.postRepo.find({
      where,
      select,
      relations,
      take: limit,
      skip: page * limit || 0,
      order,
    });
  }

  findOne(params: FindOneParams<PostEntity>) {
    const { where, relations, select } = params;
    return this.postRepo.findOne({ where, relations, select });
  } 

  async userPosts(userId: number, params: GetUserPostsDto) {
    const { page = 0, limit = 10 } = params;

    return this.find({
      where: {
        user: {
          id: userId,
        },
      },
      limit,
      page,
      order: {
        id: 'DESC',
      },
    });
  }

  async create(params: CreatePostDto) {
    const myUser = await this.cls.get<User>('user');

    const images = params.images.map((id) => ({ id }));

    let post = this.postRepo.create({
      ...params,
      images,
      user: {
        id: myUser.id,
      },
    });

    await post.save();

    return {
      status: true,
      post,
    };
  }

  async toggleLike(postId: number, userId: number) {
    let myUser = await this.cls.get<User>('user');

    let post = await this.findOne({
      where: { id: postId, user: { id: userId } },
    });

    if (!post) throw new NotFoundException();

    const checkLiked = post.likes.includes(myUser.id);

    if (checkLiked) {
      post.likes = post.likes.filter((userId) => userId !== myUser.id);
    } else {
      post.likes.push(myUser.id);
    }

    await post.save();

    return {
      status: true,
      message: 'successful',
    };
  }
}
