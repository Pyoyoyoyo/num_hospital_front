import api from './api';

const USER_DETAIL_API_URL = 'http://localhost:8083/api/user-details';

class UserService {
  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг auth user ID-аар авах
   * @param authUserId Auth системд бүртгэлтэй хэрэглэгчийн ID
   */
  async getUserDetailsByAuthId(authUserId: string) {
    try {
      const response = await api.get(`${USER_DETAIL_API_URL}/auth-user/${authUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  }

  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг бүртгэх
   * @param userDetails Хэрэглэгчийн дэлгэрэнгүй мэдээлэл
   */
  async createUserDetails(userDetails: any) {
    const response = await api.post(USER_DETAIL_API_URL, userDetails);
    return response.data;
  }

  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг шинэчлэх
   * @param id Хэрэглэгчийн мэдээллийн ID
   * @param userDetails Шинэчлэх мэдээлэл
   */
  async updateUserDetails(id: string, userDetails: any) {
    const response = await api.put(`${USER_DETAIL_API_URL}/${id}`, userDetails);
    return response.data;
  }
}

export default new UserService(); 