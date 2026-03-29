import axios from 'axios';
import {
  randAmount,
  randEmail,
  randFullName,
  randPassword,
} from '@ngneat/falso';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('GET /health', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api/health`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'server Ok' });
  });
});

describe('Happy Path', () => {
  let token = '';
  let clientId = '';
  const user = {
    email: randEmail(),
    password: randPassword(),
    name: randFullName(),
  };

  const clients = [
    {
      email: randEmail(),
      name: randFullName(),
      salary: randAmount() * 100,
      valuation: randAmount() * 1000,
    },
    {
      email: randEmail(),
      name: randFullName(),
      salary: randAmount() * 100,
      valuation: randAmount() * 1000,
    },
  ];
  it('should succeed by creating a user', async () => {
    const res = await axios.post(`/api/auth/register`, {
      email: user.email,
      password: user.password,
      name: user.name,
    });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({
      name: user.name,
      email: user.email,
      created_at: expect.any(String),
    });
  });
  it('should succeed by login a user', async () => {
    const res = await axios.post(`/api/auth/login`, {
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      access_token: expect.any(String),
      user: {
        id: expect.any(String),
        name: user.name,
        email: user.email,
      },
    });
    token = res.data.access_token;
  });
  it('should succeed by creating a client', async () => {
    const res = await axios.post(
      `/api/clients`,
      {
        email: clients[0].email,
        name: clients[0].name,
        salary: clients[0].salary,
        valuation: clients[0].valuation,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    expect(res.status).toBe(201);
    expect(res.data).toEqual({
      name: clients[0].name,
      email: clients[0].email,
      salary: clients[0].salary,
      valuation: clients[0].valuation,
      created_at: expect.any(String),
      deleted_at: null,
    });
  });
  it('should succeed by listing clients', async () => {
    const res = await axios.get(`/api/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      data: [
        {
          publicId: expect.any(String),
          name: clients[0].name,
          email: clients[0].email,
          salary: clients[0].salary,
          valuation: clients[0].valuation,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    clientId = res.data.data[0].publicId;
  });
  it('should succeed by updating a client', async () => {
    const newEmail = randEmail();
    const newSalary = randAmount() * 100;
    const newValuation = randAmount() * 1000;
    const res = await axios.put(
      `/api/clients/${clientId}`,
      {
        email: newEmail,
        name: clients[0].name,
        salary: newSalary,
        valuation: newValuation,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      id: 1,
      publicId: clientId,
      name: clients[0].name,
      email: newEmail,
      salary: newSalary,
      valuation: newValuation,
      created_at: expect.any(String),
      deleted_at: null,
    });
  });
  it('should succeed by deleting a client', async () => {
    const res = await axios.delete(`/api/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      id: expect.any(Number),
      publicId: clientId,
      name: clients[0].name,
      email: expect.any(String),
      salary: expect.any(Number),
      valuation: expect.any(Number),
      created_at: expect.any(String),
      deleted_at: expect.any(String),
    });
  });
});
