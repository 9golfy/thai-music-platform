import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2 } from 'lucide-react';
import DeleteCertificateButton from './DeleteCertificateButton';
import DownloadCertificateButton from './DownloadCertificateButton';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function getCertificates() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');

    const certificates = await certificatesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return certificates.map((cert) => ({
      ...cert,
      _id: cert._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  } finally {
    await client.close();
  }
}

export default async function CertificatesDataTable() {
  const certificates = await getCertificates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการใบประกาศ ({certificates.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  โรงเรียน
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  ประเภท
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  เลขที่
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  วันที่ออก
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
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-lg">ไม่พบข้อมูล</p>
                      <p className="text-sm">ยังไม่มีใบประกาศในระบบ</p>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((cert: any) => (
                  <tr
                    key={cert._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        {cert.schoolName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          cert.certificateType === 'register100'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {cert.certificateType === 'register100'
                          ? '100%'
                          : 'Support'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">
                      {cert.certificateNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {cert.issueDate
                        ? new Date(cert.issueDate).toLocaleDateString('th-TH', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={cert.isActive ? 'default' : 'secondary'}>
                        {cert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dcp-admin/dashboard/certificates/${cert._id}`}
                        >
                          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </Link>
                        <DownloadCertificateButton
                          certificateId={cert._id}
                          schoolName={cert.schoolName}
                          certificateNumber={cert.certificateNumber}
                        />
                        <DeleteCertificateButton
                          certificateId={cert._id}
                          schoolName={cert.schoolName}
                        />
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
  );
}
