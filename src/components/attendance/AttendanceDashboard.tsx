import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  FileText,
  History,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface AttendanceRecord {
  id: string;
  type: "check-in" | "check-out";
  timestamp: string;
  location?: string;
  status: "verified" | "pending";
  latitude?: number;
  longitude?: number;
}

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  department: string;
  additional_details?: string;
}

export default function AttendanceDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      checkCurrentStatus();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("user_id", user?.id)
        .order("timestamp", { ascending: false })
        .limit(10);

      if (attendanceError) throw attendanceError;

      // Fetch leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (leaveError) throw leaveError;

      setAttendanceRecords(attendanceData || []);
      setLeaveRequests(leaveData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: t('toasts.loadDataErrorTitle'),
        description: t('toasts.loadDataErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("user_id", user?.id)
        .gte("timestamp", today)
        .order("timestamp", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setIsCheckedIn(data[0].type === "check-in");
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    });
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      const { error } = await supabase.from("attendance_records").insert({
        user_id: user?.id,
        type: "check-in",
        latitude,
        longitude,
        location: "Current Location",
        status: "verified",
      });

      if (error) throw error;

      setIsCheckedIn(true);
      toast({
        title: t('toasts.checkInSuccessTitle'),
        description: t('toasts.checkInSuccessDesc'),
      });

      fetchData();
    } catch (error) {
      console.error("Error checking in:", error);
      toast({
        title: t('toasts.checkInFailedTitle'),
        description:
          error instanceof Error
            ? error.message
            : t('toasts.checkInFailedDesc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      const { error } = await supabase.from("attendance_records").insert({
        user_id: user?.id,
        type: "check-out",
        latitude,
        longitude,
        location: "Current Location",
        status: "verified",
      });

      if (error) throw error;

      setIsCheckedIn(false);
      toast({
        title: t('toasts.checkOutSuccessTitle'),
        description: t('toasts.checkOutSuccessDesc'),
      });

      fetchData();
    } catch (error) {
      console.error("Error checking out:", error);
      toast({
        title: t('toasts.checkOutFailedTitle'),
        description:
          error instanceof Error
            ? error.message
            : t('toasts.checkOutFailedDesc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome', { name: user?.user_metadata?.full_name || user?.email })}
          </h1>
          <p className="text-lg text-gray-600">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-2xl font-mono text-blue-600 mt-2">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{t('dashboard.recordAttendance')}</CardTitle>
              <CardDescription>
                {t('dashboard.recordAttendanceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {!isCheckedIn ? (
                <Button
                  onClick={handleCheckIn}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? t('buttons.checkingIn') : t('buttons.checkIn')}
                </Button>
              ) : (
                <Button
                  onClick={handleCheckOut}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? t('buttons.checkingOut') : t('buttons.checkOut')}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{t('dashboard.requestLeave')}</CardTitle>
              <CardDescription>
                {t('dashboard.requestLeaveDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => (window.location.href = "/leave-request")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t('dashboard.newRequest')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance History */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                {t('dashboard.recentAttendance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-gray-600">{t('buttons.loading')}</span>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('dashboard.noAttendanceRecords')}</p>
                  <p className="text-sm">{t('dashboard.startByCheckingIn')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            record.type === "check-in"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {t(record.type === 'check-in' ? 'dashboard.checkInType' : 'dashboard.checkOutType')}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p>{record.location || t('dashboard.locationNotAvailable')}</p>
                            {record.latitude && record.longitude && (
                              <button
                                onClick={() => {
                                  const url = `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;
                                  window.open(url, "_blank");
                                }}
                                className="text-blue-600 hover:text-blue-800 underline text-xs mt-1 block"
                              >
                                {record.latitude.toFixed(6)},{" "}
                                {record.longitude.toFixed(6)}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(record.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                {t('dashboard.leaveRequests')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-gray-600">{t('buttons.loading')}</span>
                </div>
              ) : leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('dashboard.noLeaveRequests')}</p>
                  <p className="text-sm">{t('dashboard.submitFirstRequest')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {request.leave_type}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.reason}
                      </p>
                      {request.additional_details && (
                        <p className="text-xs text-gray-500 mb-2">
                          {request.additional_details}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(request.start_date).toLocaleDateString()} -{" "}
                          {new Date(request.end_date).toLocaleDateString()}
                        </span>
                        <span>{request.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
