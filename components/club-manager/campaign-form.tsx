"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, FileText, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: string
  question: string
  type: "text" | "multiple-choice" | "file"
  options?: string[]
  is_required: boolean
}

interface CampaignFormProps {
  initialData?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function CampaignForm({ initialData, onSave, onCancel }: CampaignFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split("T")[0] : "",
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split("T")[0] : "",
    max_applications: initialData?.max_applications || "",
  })

  const [questions, setQuestions] = useState<Question[]>(initialData?.application_questions || [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: "text",
      is_required: false,
    }
    setQuestions((prev) => [...prev, newQuestion])
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...(q.options || []), ""],
          }
        }
        return q
      }),
    )
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...(q.options || [])]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...(q.options || [])]
          newOptions.splice(optionIndex, 1)
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.description || !formData.start_date || !formData.end_date) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
      })
      return
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        title: "Lỗi",
        description: "Ngày kết thúc phải sau ngày bắt đầu.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const campaignData = {
        ...formData,
        application_questions: questions.filter((q) => q.question.trim() !== ""),
        max_applications: formData.max_applications ? Number.parseInt(formData.max_applications) : undefined,
      }

      await onSave(campaignData)

      toast({
        title: "Thành công",
        description: "Chiến dịch đã được lưu thành công.",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu chiến dịch.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề chiến dịch *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ví dụ: Tuyển thành viên mùa xuân 2024"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về chiến dịch tuyển dụng..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="requirements">Yêu cầu</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="Liệt kê các yêu cầu đối với ứng viên..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Ngày bắt đầu *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="end_date">Ngày kết thúc *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max_applications">Số lượng đơn tối đa (tùy chọn)</Label>
            <Input
              id="max_applications"
              type="number"
              value={formData.max_applications}
              onChange={(e) => handleInputChange("max_applications", e.target.value)}
              placeholder="Để trống nếu không giới hạn"
              min="1"
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Application Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Câu hỏi ứng tuyển
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion} disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm câu hỏi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có câu hỏi nào</p>
              <p className="text-sm">Thêm câu hỏi để thu thập thông tin từ ứng viên</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">Câu {index + 1}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Câu hỏi</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                          placeholder="Nhập câu hỏi..."
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Loại câu hỏi</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestion(question.id, "type", value)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Văn bản</SelectItem>
                              <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                              <SelectItem value="file">Tệp đính kèm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center pt-6">
                          <input
                            type="checkbox"
                            id={`required-${question.id}`}
                            checked={question.is_required}
                            onChange={(e) => updateQuestion(question.id, "is_required", e.target.checked)}
                            className="mr-2"
                            disabled={isSubmitting}
                          />
                          <Label htmlFor={`required-${question.id}`}>Bắt buộc</Label>
                        </div>
                      </div>

                      {question.type === "multiple-choice" && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Các lựa chọn</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                              disabled={isSubmitting}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Thêm lựa chọn
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(question.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`Lựa chọn ${optionIndex + 1}`}
                                  disabled={isSubmitting}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(question.id, optionIndex)}
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Tạo chiến dịch"}
        </Button>
      </div>
    </form>
  )
}
