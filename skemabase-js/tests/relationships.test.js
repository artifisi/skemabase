const { parse, generateSQL } = require('../src');

describe('relationship SQL generation', () => {
  it('generates foreign key for has_many relationship', () => {
    const text = `
Author has attributes: name
Book has attributes: title
Author has many Book
`;
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    // Check author table
    expect(sql).toContain('CREATE TABLE author');
    expect(sql).toContain('name TEXT');
    // Check book table and foreign key
    expect(sql).toContain('CREATE TABLE book');
    expect(sql).toContain('title TEXT');
    expect(sql).toContain('author_id INTEGER REFERENCES author(id)');
  });

  it('generates one-to-one relationship with UNIQUE constraint', () => {
    const text = `
User has attributes: username
Profile has attributes: bio
User has one Profile
`;
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    // Profile table should have foreign key with UNIQUE
    expect(sql).toContain('CREATE TABLE profile');
    expect(sql).toContain('bio TEXT');
    expect(sql).toContain('user_id INTEGER REFERENCES user(id) UNIQUE');
  });

  it('generates join table for many-to-many relationships', () => {
    const text = `
Student has attributes: name
Course has attributes: title
Student has and belongs to many Course
`;
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    // Check join table created
    expect(sql).toContain('CREATE TABLE course_student');
    expect(sql).toContain('course_id INTEGER REFERENCES course(id)');
    expect(sql).toContain('student_id INTEGER REFERENCES student(id)');
    expect(sql).toContain('PRIMARY KEY (course_id, student_id)');
  });
});