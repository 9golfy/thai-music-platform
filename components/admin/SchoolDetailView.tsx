'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SchoolDetailViewProps {
  school: any;
  type: 'register100' | 'register-support';
}

export default function SchoolDetailView({ school, type }: SchoolDetailViewProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const basePath = type === 'register100' ? 'register100' : 'register-support';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const apiPath = type === 'register100' ? 'register100' : 'register-support';
      const response = await fetch(`/api/${apiPath}/${school._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/dcp-admin/dashboard/${basePath}`);
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dcp-admin/dashboard/${basePath}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{school.schoolName}</h1>
            <p className="text-gray-600 mt-1">รายละเอียดโรงเรียน</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Link href={`/dcp-admin/dashboard/${basePath}/${school._id}?mode=edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              แก้ไข
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                ลบ
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                <AlertDialogDescription>
                  คุณต้องการลบข้อมูลของ <strong>{school.schoolName}</strong> ใช่หรือไม่?
                  <br /><br />
                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'กำลังลบ...' : 'ลบข้อมูล'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Score Badge */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">คะแนนรวม</p>
              <p className="text-4xl font-bold text-blue-600">{school.totalScore || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">วันที่สมัคร</p>
              <p className="text-lg font-medium">
                {school.createdAt
                  ? new Date(school.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">รหัสโรงเรียน</p>
              <p className="font-medium">{school.schoolId || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ชื่อโรงเรียน</p>
              <p className="font-medium">{school.schoolName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">จังหวัด</p>
              <p className="font-medium">{school.schoolProvince || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">อำเภอ</p>
              <p className="font-medium">{school.district || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ตำบล</p>
              <p className="font-medium">{school.subdistrict || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">รหัสไปรษณีย์</p>
              <p className="font-medium">{school.postalCode || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">อีเมล</p>
              <p className="font-medium">{school.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
              <p className="font-medium">{school.phone || '-'}</p>
            </div>
          </div>
          {school.address && (
            <div>
              <p className="text-sm text-gray-600">ที่อยู่</p>
              <p className="font-medium">{school.address}</p>
            </div>
          )}
          {school.principalName && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">ชื่อผู้อำนวยการ</p>
                <p className="font-medium">{school.principalName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">เบอร์โทรผู้อำนวยการ</p>
                <p className="font-medium">{school.principalPhone || '-'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All 8 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        {school.step1 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 1</CardTitle>
                <Badge variant={school.step1.score > 0 ? 'default' : 'secondary'}>
                  {school.step1.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {type === 'register100' ? (
                  <>
                    <div>
                      <span className="text-gray-600">มีนโยบาย: </span>
                      <span>{school.step1.hasPolicy ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step1.policyDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step1.policyDetails}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-600">มีการสนับสนุน: </span>
                      <span>{school.step1.hasSupport ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step1.supportDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step1.supportDetails}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {school.step2 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 2</CardTitle>
                <Badge variant={school.step2.score > 0 ? 'default' : 'secondary'}>
                  {school.step2.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {type === 'register100' ? (
                  <>
                    <div>
                      <span className="text-gray-600">มีหลักสูตร: </span>
                      <span>{school.step2.hasCurriculum ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step2.curriculumDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step2.curriculumDetails}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-600">มีพื้นที่: </span>
                      <span>{school.step2.hasSpace ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step2.spaceDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step2.spaceDetails}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {school.step3 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 3</CardTitle>
                <Badge variant={school.step3.score > 0 ? 'default' : 'secondary'}>
                  {school.step3.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">มีครูผู้สอน: </span>
                  <span>{school.step3.hasTeachers ? 'มี' : 'ไม่มี'}</span>
                </div>
                <div>
                  <span className="text-gray-600">จำนวนครู: </span>
                  <span>{school.step3.teacherCount || 0} คน</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 */}
        {school.step4 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 4</CardTitle>
                <Badge variant={school.step4.score > 0 ? 'default' : 'secondary'}>
                  {school.step4.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">มีเครื่องดนตรี: </span>
                  <span>{school.step4.hasInstruments ? 'มี' : 'ไม่มี'}</span>
                </div>
                {school.step4.instrumentList && (
                  <div>
                    <span className="text-gray-600">รายการ: </span>
                    <span>{school.step4.instrumentList}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5 */}
        {school.step5 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 5</CardTitle>
                <Badge variant={school.step5.score > 0 ? 'default' : 'secondary'}>
                  {school.step5.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">มีกิจกรรม: </span>
                  <span>{school.step5.hasActivities ? 'มี' : 'ไม่มี'}</span>
                </div>
                {school.step5.activityDetails && (
                  <div>
                    <span className="text-gray-600">รายละเอียด: </span>
                    <span>{school.step5.activityDetails}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6 */}
        {school.step6 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 6</CardTitle>
                <Badge variant={school.step6.score > 0 ? 'default' : 'secondary'}>
                  {school.step6.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {type === 'register100' ? (
                  <>
                    <div>
                      <span className="text-gray-600">มีการแสดง: </span>
                      <span>{school.step6.hasPerformance ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step6.performanceDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step6.performanceDetails}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-600">มีความร่วมมือ: </span>
                      <span>{school.step6.hasCollaboration ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step6.collaborationDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step6.collaborationDetails}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7 */}
        {school.step7 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 7</CardTitle>
                <Badge variant={school.step7.score > 0 ? 'default' : 'secondary'}>
                  {school.step7.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {type === 'register100' ? (
                  <>
                    <div>
                      <span className="text-gray-600">มีรางวัล: </span>
                      <span>{school.step7.hasAwards ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step7.awardDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step7.awardDetails}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-600">มีการประชาสัมพันธ์: </span>
                      <span>{school.step7.hasPromotion ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step7.promotionDetails && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step7.promotionDetails}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 8 */}
        {school.step8 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ขั้นตอนที่ 8</CardTitle>
                <Badge variant={school.step8.score > 0 ? 'default' : 'secondary'}>
                  {school.step8.score || 0} คะแนน
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {type === 'register100' ? (
                  <>
                    <div>
                      <span className="text-gray-600">มีแผนพัฒนา: </span>
                      <span>{school.step8.hasDevelopment ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step8.developmentPlan && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step8.developmentPlan}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-600">มีแผนอนาคต: </span>
                      <span>{school.step8.hasFuturePlan ? 'มี' : 'ไม่มี'}</span>
                    </div>
                    {school.step8.futurePlan && (
                      <div>
                        <span className="text-gray-600">รายละเอียด: </span>
                        <span>{school.step8.futurePlan}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Teachers List */}
      {school.teachers && school.teachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อครูผู้สอน ({school.teachers.length} คน)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {school.teachers.map((teacher: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {teacher.name || `${teacher.firstName} ${teacher.lastName}`}
                      </p>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {teacher.email && (
                          <div>
                            <span>อีเมล: </span>
                            <span>{teacher.email}</span>
                          </div>
                        )}
                        {teacher.phone && (
                          <div>
                            <span>เบอร์: </span>
                            <span>{teacher.phone}</span>
                          </div>
                        )}
                        {teacher.subject && (
                          <div>
                            <span>วิชา: </span>
                            <span>{teacher.subject}</span>
                          </div>
                        )}
                        {teacher.education && (
                          <div>
                            <span>วุฒิการศึกษา: </span>
                            <span>{teacher.education}</span>
                          </div>
                        )}
                        {teacher.experience && (
                          <div>
                            <span>ประสบการณ์: </span>
                            <span>{teacher.experience} ปี</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {teacher.image && (
                      <img
                        src={teacher.image}
                        alt={`Teacher ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional sections can be added here */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono">{school._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สร้างเมื่อ:</span>
              <span>
                {school.createdAt
                  ? new Date(school.createdAt).toLocaleString('th-TH')
                  : '-'}
              </span>
            </div>
            {school.updatedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">แก้ไขล่าสุด:</span>
                <span>{new Date(school.updatedAt).toLocaleString('th-TH')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
