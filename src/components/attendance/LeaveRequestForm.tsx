import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";

interface LeaveRequestFormProps {
  onBack?: () => void;
}

// const departments array removed as it's no longer needed

const leaveTypes = [
  "AnnualLeave",
  "SickLeave",
  "PersonalLeave",
  "MaternityPaternityLeave",
  "EmergencyLeave",
  "BereavementLeave",
  "StudyLeave",
];

const leaveReasons = [
  "Vacation",
  "Medicalappointment",
  "Familyemergency",
  "Personalmatters",
  "Wedding",
  "Funeral",
  "EducationTraining",
  "Other",
];

export default function LeaveRequestForm({ onBack }: LeaveRequestFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null); // State untuk data profil user
  const { toast } = useToast();

  // Load user profile dan set department otomatis
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Function untuk fetch profil user dan set department
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("department")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data && data.department) {
        setDepartment(data.department); // Auto-fill department dari profil
        setUserProfile(data);
      } else {
        // If no department found, try to get from user metadata or set empty
        console.log(t('leaveRequest.form.departmentNotSet'));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!department || !leaveType || !reason || !startDate || !endDate) {
      toast({
        title: t('leaveRequest.toasts.missingInfo.title'),
        description: t('leaveRequest.toasts.missingInfo.description'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('leaveRequest.toasts.authError.title'),
        description: t('leaveRequest.toasts.authError.description'),
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: t('leaveRequest.toasts.invalidDate.title'),
        description: t('leaveRequest.toasts.invalidDate.description'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leave_requests").insert({
        user_id: user.id,
        department,
        leave_type: leaveType, // Storing the key
        reason: reason, // Storing the key
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        additional_details: additionalDetails || null,
        status: "pending",
      });

      if (error) throw error;

      // Setelah berhasil submit, panggil Edge Function untuk kirim email notifikasi
      try {
        const applicantName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'N/A';
        const applicantEmail = user?.email;

        const { data: funcData, error: funcError } = await supabase.functions.invoke(
          'send-leave-notification', 
          {
            body: {
              applicantName,
              applicantEmail,
              department,
              leaveType: t(`leaveRequest.leaveTypes.${leaveType}`),
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              reason: t(`leaveRequest.leaveReasons.${reason}`),
              additionalDetails
            }
          }
        );

        if (funcError) {
          console.error('Error calling send-leave-notification function:', funcError);
          // Tidak perlu toast error ke user karena submit izin sudah berhasil
          // Cukup log errornya saja
        } else {
          console.log('send-leave-notification function called successfully:', funcData);
        }
      } catch (emailError) {
        console.error('Error preparing or sending leave notification email:', emailError);
      }

      toast({
        title: t('leaveRequest.toasts.submitSuccess.title'),
        description: t('leaveRequest.toasts.submitSuccess.description'),
      });

      // Reset form
      setDepartment("");
      setLeaveType("");
      setReason("");
      setStartDate(undefined);
      setEndDate(undefined);
      setAdditionalDetails("");

      // Navigate back to dashboard after successful submission
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast({
        title: t('leaveRequest.toasts.submitFailed.title'),
        description: t('leaveRequest.toasts.submitFailed.description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('leaveRequest.page.title')}
            </h1>
            <p className="text-gray-600">
              {t('leaveRequest.page.description')}
            </p>
          </div>
        </div>

        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle>{t('leaveRequest.form.title')}</CardTitle>
            <CardDescription>
              {t('leaveRequest.form.description')} {t('leaveRequest.form.allFieldsRequired')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department Selection - Auto-filled dari profil */}
              <div className="space-y-2">
                <Label htmlFor="department">{t('leaveRequest.form.department')}</Label>
                <Input
                  id="department"
                  type="text"
                  value={department}
                  readOnly
                  className="h-12 bg-gray-100 cursor-not-allowed"
                  placeholder={userProfile?.department ? "" : t('leaveRequest.form.fetchingDepartment')}
                />
                {userProfile?.department ? (
                  <p className="text-xs text-green-600">
                    {t('leaveRequest.form.departmentAutoFilled')}
                  </p>
                ) : (
                  !department && (
                    <p className="text-xs text-orange-600">
                      {t('leaveRequest.form.departmentNotSetWarning')}
                    </p>
                  )
                )}
              </div>

              {/* Leave Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">{t('leaveRequest.form.leaveType')} *</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('leaveRequest.form.selectLeaveType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`leaveRequest.leaveTypes.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason Selection */}
              <div className="space-y-2">
                <Label htmlFor="reason">{t('leaveRequest.form.reason')} *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('leaveRequest.form.selectReason')} />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveReasons.map((reasonOption) => (
                      <SelectItem key={reasonOption} value={reasonOption}>
                        {t(`leaveRequest.leaveReasons.${reasonOption}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('leaveRequest.form.startDate')} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate
                          ? format(startDate, "PPP")
                          : t('leaveRequest.form.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>{t('leaveRequest.form.endDate')} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : t('leaveRequest.form.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <Label htmlFor="additional-details">{t('leaveRequest.form.additionalDetails')}</Label>
                <Textarea
                  id="additional-details"
                  placeholder={t('leaveRequest.form.additionalDetailsPlaceholder')}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t('leaveRequest.form.submitting')}
                    </>
                  ) : (
                    t('leaveRequest.form.submitButton')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
