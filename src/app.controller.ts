import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // Not => id가 1이 아닌 것을 찾는다.
        // id: Not(1),
        // 적거나 같거나 큰 경우 가져오기
        // id: LessThan(20),
        // id: LessThanOrEqual(20),
        // id: MoreThan(20),
        // id: MoreThanOrEqual(20),
        // id: Equal(1),
        // 유사값
        // 대문자와 소문자 구분 안 하는 유사값
        // email: Like('%gmail%'),
        // email: ILike('%GMAIL%'),
        // 사이값
        // id: Between(1, 20),
        // 해당되는 여러개의 값
        // id: In([1, 2, 3, 6]),
        // Null 값인 경우 가져오기
        // id: IsNull(),
      },

      // 어떤 프로퍼티를 가져올지 선택할 수 있다.
      // 기본값은 모든 프로퍼티를 가져온다.
      // 만약에 select 옵션을 사용하지 않으면 모든 프로퍼티를 가져온다.
      // select: {
      //   id: true,
      //   email: true,
      //   createdAt: false,
      //   version: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // where 옵션은 조건을 걸 수 있다.
      // email이 'younha0012@gmail'인 데이터를 찾는다.
      // 만약 빈 객체를 넣으면 모든 데이터를 가져온다.
      // 그냥 쉼표로 구분하면 and 조건이를.
      // or 조건을 사용하고 싶다면 리스트를 사용한다.

      // 관계를 가져오는 법
      // relations: {
      //   profile: true,
      // },
      // 오름차순 내림차순
      // 'ASC' | 'DESC'
      order: {
        id: 'ASC',
      },
      // skip은 처음 몇 개를 제외하고 가져올지
      // skip: 0,
      // take는 몇 개를 가져올지
      // 기본값은 0, 전체를 가져온다.
      // take: 2,
    });
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1: UserModel = this.userRepository.create({
    //   email: 'test@gmail.com',
    // });
    // 생성 + 저장
    // const user2: UserModel = await this.userRepository.save({
    //   email: 'test1@gmail.com',
    // });
    // return user2;
    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저장하지는 않음
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'younha@naver.com',
    // });
    // 삭제하기
    // await this.userRepository.delete({
    //   id: 101,
    // });
    // increment
    // 조건에 해당되는 Row의 프로퍼티를 증가시킬 수 있다.
    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );
    // decrement
    // 조건에 해당되는 Row의 프로퍼티를 감소시킬 수 있다.
    // await this.userRepository.decrement(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   1,
    // );
    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });
    // sum
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%2%'),
    // });
    // average
    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // min
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });
    //
    // max
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    // findOne
    // const user1 = await this.userRepository.findOne({
    //   where: {
    //     id: 1,
    //   },
    // });

    // findAndCounts
    // 반환값의 두 번째는 값의 개수
    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });

    return usersAndCount;
  }

  @Post('users')
  postUsers() {
    for (let i = 0; i < 100; i++) {
      this.userRepository.save({
        email: `user-${i}@gmail.com`,
      });
    }
  }

  @Patch('users/:id')
  async patchUsers(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    return this.userRepository.save({
      ...user,
      email: user.email + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'younha0012@gmail.com',
      profile: {
        profileImg: 'test1.img',
      },
    });
    // const profile = await this.profileRepository.save({
    //   profileImg: 'test.img',
    //   user,
    // });
    return user;
  }

  @Post('user/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'younha00@naver.com',
    });
    await this.postRepository.save({
      author: user,
      title: 'test1',
    });

    await this.postRepository.save({
      author: user,
      title: 'test2',
    });
    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS 강의',
    });
    const post2 = await this.postRepository.save({
      title: 'TypeORM 강의',
    });
    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'Flutter',
      posts: [post1],
    });
    await this.postRepository.save({
      title: 'Flutter 강의',
      tags: [tag1, tag2],
    });
    return true;
  }

  @Get('posts')
  async getPosts() {
    return this.postRepository.find({
      relations: ['tags'],
    });
  }

  @Get('tags')
  async getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
