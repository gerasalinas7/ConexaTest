import { MovieSchema } from './movie.schema';

describe('MovieSchema', () => {
  it('should be defined', () => {
    expect(new MovieSchema()).toBeDefined();
  });
});
