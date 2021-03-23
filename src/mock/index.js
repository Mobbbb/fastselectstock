import Mock from 'mockjs';
import { getIndustryData, getNovelData } from './mock';

Mock.mock(/\/mock\/api\/hy/, getIndustryData);

Mock.mock(/\/mock\/api\/gn/, getNovelData);

export default Mock;
