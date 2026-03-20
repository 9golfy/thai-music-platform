import { MongoClient } from 'mongodb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';
import { AuthSession } from '@/lib/types/user.types';
import Link from 'next/link';
import DeleteUserButton from './DeleteUserButton';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function getUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  } finally {
    await client.close();
  }
}

interface UsersDataTableProps {
  session: AuthSession;
}

export default async function UsersDataTable({ session }: UsersDataTableProps) {
  const users = await getUsers();

  const adminUsers = users.filter((u: any) => ['root', 'admin', 'super_admin'].includes(u.role));
  const teacherUsers = users.filter((u: any) => u.role === 'teacher');

  return (
    <Tabs defaultValue="admins" className="space-y-4">
      <TabsList>
        <TabsTrigger value="admins">
          เจ้าหน้าที่ ({adminUsers.length})
        </TabsTrigger>
        <TabsTrigger value="teachers">
          ครูผู้สอน ({teacherUsers.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="admins">
        <Card>
          <CardHeader>
            <CardTitle>เจ้าหน้าที่ Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      เบอร์โทร
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      สถานะ
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map((user: any) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.firstName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.phone || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={user.role === 'root' || user.role === 'super_admin' ? 'default' : 'secondary'}
                            >
                              {user.role}
                            </Badge>
                            {(user.isSystemAdmin === true || user.email === 'root@thaimusic.com') && (
                              <Badge variant="destructive" className="text-xs">
                                System Admin
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/dcp-admin/dashboard/users/${user._id}`}>
                              <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center gap-1">
                                <Pencil className="w-4 h-4" />
                                Edit
                              </button>
                            </Link>
                            {session.role === 'root' && 
                             user.role !== 'root' && 
                             user.isSystemAdmin !== true && 
                             user.email !== 'root@thaimusic.com' && (
                              <DeleteUserButton 
                                userId={user._id} 
                                userName={`${user.firstName} ${user.lastName}`}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="teachers">
        <Card>
          <CardHeader>
            <CardTitle>ครูผู้สอน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      เบอร์โทร
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      School ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      สถานะ
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teacherUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  ) : (
                    teacherUsers.map((user: any) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">
                                {user.firstName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.phone || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-gray-600">
                          {user.schoolId || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/dcp-admin/dashboard/users/${user._id}`}>
                              <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center gap-1">
                                <Pencil className="w-4 h-4" />
                                Edit
                              </button>
                            </Link>
                            {((session.role === 'root') || (session.role === 'admin')) && 
                             user.isSystemAdmin !== true && 
                             user.email !== 'root@thaimusic.com' && (
                              <DeleteUserButton 
                                userId={user._id} 
                                userName={`${user.firstName} ${user.lastName}`}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
