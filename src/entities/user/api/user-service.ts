export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type CreateUserDto = Pick<User, 'name'>;

const API_BASE = 'https://67339cb7a042ab85d1177146.mockapi.io';

const delay = () => new Promise((res) => setTimeout(res, 2000));

export const userService = {
  async findUser({ id }: { id: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`);
    await delay();
    if (!res.ok) throw new Error(`User ${id} not found`);
    return res.json();
  },

  async findUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    await delay();
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    await delay();
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  async updateUser({ id, name }: Pick<User, 'id' | 'name'>): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    await delay();
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },
};
