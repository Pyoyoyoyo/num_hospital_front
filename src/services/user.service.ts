import api from './api';

const USER_DETAIL_API_URL = 'http://localhost:8080/api/user-details';

class UserService {
  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг sisiId-аар авах
   * @param sisiId Auth системд бүртгэлтэй хэрэглэгчийн нэвтрэх нэр
   */
  async getUserDetailsBySisiId(sisiId: string) {
    try {
      const response = await api.get(`${USER_DETAIL_API_URL}/sisi-user/${sisiId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw error;
    }
  }

  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг бүртгэх
   * @param userDetails Хэрэглэгчийн дэлгэрэнгүй мэдээлэл
   */
  async createUserDetails(userDetails: any) {
    try {
      const response = await api.post(USER_DETAIL_API_URL, userDetails);
      return response.data;
    } catch (error) {
      console.error('Failed to create user details:', error);
      throw error;
    }
  }

  /**
   * Хэрэглэгчийн дэлгэрэнгүй мэдээллийг шинэчлэх
   * @param id Хэрэглэгчийн мэдээллийн ID
   * @param userDetails Шинэчлэх мэдээлэл
   */
  async updateUserDetails(id: string, userDetails: any) {
    try {
      const response = await api.put(`${USER_DETAIL_API_URL}/${id}`, userDetails);
      return response.data;
    } catch (error) {
      console.error('Failed to update user details:', error);
      throw error;
    }
  }
}

export default new UserService();