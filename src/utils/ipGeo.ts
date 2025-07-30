import axios from 'axios';

interface RandomUserResponse {
  results: [
    {
      name: {
        first: string;
        last: string;
      };
      phone: string;
    },
  ];
}

export async function getRandomUser(): Promise<{
  name: string;
  phone: string;
  password: string;
  email: string;
}> {
  try {
    const response = await axios.get<RandomUserResponse>('https://randomuser.me/api/', {
      params: {
        nat: 'US',
        inc: 'name,phone,id',
      },
    });

    const { first, last } = response.data.results[0].name;
    let { phone } = response.data.results[0];

    // 处理phone为国际号码格式（不带+号），如 17782330959
    phone = phone.replace(/[^\d]/g, ''); // 移除所有非数字字符
    if (phone.length === 10) {
      phone = '1' + phone;
    } else if (phone.length === 11 && phone.startsWith('1')) {
      // already correct
    } else if (!phone.startsWith('1')) {
      phone = '1' + phone; // fallback
    }

    // 随机密码
    const password = Math.random().toString(36).substring(2, 8);

    return {
      name: `${first} ${last}`,
      phone,
      password,
      email: `${first}@gmail.com`,
    };
  } catch (error) {
    console.error('获取随机用户信息失败:', error);
    throw error;
  }
}
