"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Check, AlertCircle, Trash2 } from "lucide-react"
import Image from "next/image"

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Department {
  id: string
  name: string
}

interface ValidationState {
  firstName: {
    valid: boolean
    required: boolean
    minLength: boolean
    maxLength: boolean
    validChars: boolean
    touched: boolean
  }
  lastName: {
    valid: boolean
    required: boolean
    minLength: boolean
    maxLength: boolean
    validChars: boolean
    touched: boolean
  }
  avatar: {
    valid: boolean
    required: boolean
    validSize: boolean
    validType: boolean
    touched: boolean
  }
  department: {
    valid: boolean
    required: boolean
    touched: boolean
  }
}

export default function EmployeeModal({ isOpen, onClose }: EmployeeModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [department, setDepartment] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validCharsRegex = /^[a-zA-Zა-ჰ]+$/

  const [validation, setValidation] = useState<ValidationState>({
    firstName: {
      valid: false,
      required: false,
      minLength: false,
      maxLength: true,
      validChars: false,
      touched: false,
    },
    lastName: {
      valid: false,
      required: false,
      minLength: false,
      maxLength: true,
      validChars: false,
      touched: false,
    },
    avatar: {
      valid: false,
      required: false,
      validSize: true,
      validType: true,
      touched: false,
    },
    department: {
      valid: false,
      required: false,
      touched: false,
    },
  })

  const [formSubmitted, setFormSubmitted] = useState(false)

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true)
      try {
        // Will replace with actual API later, for now I am just testing with this example
        setTimeout(() => {
          setDepartments([
            { id: "engineering", name: "ინჟინერია" },
            { id: "marketing", name: "მარკეტინგი" },
            { id: "sales", name: "გაყიდვები" },
            { id: "hr", name: "HR" },
            { id: "finance", name: "ფინანსები" },
          ])
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching departments:", error)
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchDepartments()
    }
  }, [isOpen])

  // Validate first name
  useEffect(() => {
    const requiredValid = firstName.trim() !== ""
    const minLengthValid = firstName.length >= 2
    const maxLengthValid = firstName.length <= 255
    const charsValid = validCharsRegex.test(firstName) || firstName === ""
    const isValid = requiredValid && minLengthValid && maxLengthValid && charsValid

    setValidation((prev) => ({
      ...prev,
      firstName: {
        ...prev.firstName,
        valid: isValid,
        required: requiredValid,
        minLength: minLengthValid,
        maxLength: maxLengthValid,
        validChars: charsValid,
      },
    }))
  }, [firstName])

  // Validate last name
  useEffect(() => {
    const requiredValid = lastName.trim() !== ""
    const minLengthValid = lastName.length >= 2
    const maxLengthValid = lastName.length <= 255
    const charsValid = validCharsRegex.test(lastName) || lastName === ""
    const isValid = requiredValid && minLengthValid && maxLengthValid && charsValid

    setValidation((prev) => ({
      ...prev,
      lastName: {
        ...prev.lastName,
        valid: isValid,
        required: requiredValid,
        minLength: minLengthValid,
        maxLength: maxLengthValid,
        validChars: charsValid,
      },
    }))
  }, [lastName])

  // Validate department
  useEffect(() => {
    const requiredValid = department !== ""

    setValidation((prev) => ({
      ...prev,
      department: {
        ...prev.department,
        valid: requiredValid,
        required: requiredValid,
      },
    }))
  }, [department])

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
    if (!validation.firstName.touched) {
      setValidation((prev) => ({
        ...prev,
        firstName: {
          ...prev.firstName,
          touched: true,
        },
      }))
    }
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
    if (!validation.lastName.touched) {
      setValidation((prev) => ({
        ...prev,
        lastName: {
          ...prev.lastName,
          touched: true,
        },
      }))
    }
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value)
    if (!validation.department.touched) {
      setValidation((prev) => ({
        ...prev,
        department: {
          ...prev.department,
          touched: true,
        },
      }))
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isFormValid = () => {
    return (
      validation.firstName.valid && validation.lastName.valid && validation.avatar.valid && validation.department.valid
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    setValidation((prev) => ({
      ...prev,
      firstName: { ...prev.firstName, touched: true },
      lastName: { ...prev.lastName, touched: true },
      avatar: { ...prev.avatar, touched: true },
      department: { ...prev.department, touched: true },
    }))

    if (isFormValid()) {
      // Will Handle form submission logic here later
      console.log({
        firstName,
        lastName,
        avatar: avatarFile,
        department,
      })
      onClose()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setValidation((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        touched: true,
      },
    }))

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const validType = validTypes.includes(file.type)

    // Validate file size (max 600KB)
    const validSize = file.size <= 600 * 1024 // 600KB in bytes

    const isValid = validType && validSize

    setValidation((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        valid: isValid,
        required: true,
        validType,
        validSize,
      },
    }))

    if (isValid) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string)
          setAvatarFile(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setValidation((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        valid: false,
        required: false,
      },
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">თანამშრომლის დამატება</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">დახურვა</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              სახელი
            </label>
            <input
              id="firstName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8338EC] focus:border-[#8338EC] ${
                validation.firstName.touched && !validation.firstName.valid
                  ? "border-red-500"
                  : validation.firstName.touched && validation.firstName.valid
                    ? "border-green-500"
                    : "border-gray-300"
              }`}
              placeholder=""
              value={firstName}
              onChange={handleFirstNameChange}
              maxLength={255}
              required
            />
            <div className="flex flex-wrap text-xs mt-1 gap-y-1">
              <div
                className={`flex items-center mr-4 ${
                  validation.firstName.touched && !validation.firstName.required
                    ? "text-red-500"
                    : validation.firstName.required
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.firstName.required ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>სავალდებულო</span>
              </div>
              <div
                className={`flex items-center mr-4 ${
                  validation.firstName.touched && !validation.firstName.minLength
                    ? "text-red-500"
                    : validation.firstName.minLength
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.firstName.minLength ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მინიმუმ 2 სიმბოლო</span>
              </div>
              <div
                className={`flex items-center mr-4 ${
                  validation.firstName.touched && !validation.firstName.maxLength
                    ? "text-red-500"
                    : validation.firstName.maxLength
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.firstName.maxLength ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მაქსიმუმ 255 სიმბოლო</span>
              </div>
              <div
                className={`flex items-center ${
                  validation.firstName.touched && !validation.firstName.validChars
                    ? "text-red-500"
                    : validation.firstName.validChars
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.firstName.validChars ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მხოლოდ ქართული და ლათინური ასოები</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              გვარი
            </label>
            <input
              id="lastName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8338EC] focus:border-[#8338EC] ${
                validation.lastName.touched && !validation.lastName.valid
                  ? "border-red-500"
                  : validation.lastName.touched && validation.lastName.valid
                    ? "border-green-500"
                    : "border-gray-300"
              }`}
              placeholder=""
              value={lastName}
              onChange={handleLastNameChange}
              maxLength={255}
              required
            />
            <div className="flex flex-wrap text-xs mt-1 gap-y-1">
              <div
                className={`flex items-center mr-4 ${
                  validation.lastName.touched && !validation.lastName.required
                    ? "text-red-500"
                    : validation.lastName.required
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.lastName.required ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>სავალდებულო</span>
              </div>
              <div
                className={`flex items-center mr-4 ${
                  validation.lastName.touched && !validation.lastName.minLength
                    ? "text-red-500"
                    : validation.lastName.minLength
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.lastName.minLength ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მინიმუმ 2 სიმბოლო</span>
              </div>
              <div
                className={`flex items-center mr-4 ${
                  validation.lastName.touched && !validation.lastName.maxLength
                    ? "text-red-500"
                    : validation.lastName.maxLength
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.lastName.maxLength ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მაქსიმუმ 255 სიმბოლო</span>
              </div>
              <div
                className={`flex items-center ${
                  validation.lastName.touched && !validation.lastName.validChars
                    ? "text-red-500"
                    : validation.lastName.validChars
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.lastName.validChars ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მხოლოდ ქართული და ლათინური ასოები</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
              ავატარი
            </label>
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer flex items-center justify-center ${
                    validation.avatar.touched && !validation.avatar.valid
                      ? "border-2 border-red-500 bg-red-50"
                      : avatar
                        ? "border border-green-500 bg-gray-100"
                        : "border border-gray-300 bg-gray-100"
                  }`}
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <Image
                      src={avatar || "/placeholder.svg"}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">+</span>
                  )}
                </div>
                {avatar && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={handleRemoveAvatar}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">წაშლა</span>
                  </button>
                )}
              </div>
              <input
                type="file"
                id="avatar"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                required={!avatar}
              />
            </div>
            <div className="flex flex-wrap justify-center text-xs mt-2 gap-y-1">
              <div
                className={`flex items-center mr-4 ${
                  validation.avatar.touched && !validation.avatar.required
                    ? "text-red-500"
                    : validation.avatar.required
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.avatar.required ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>სავალდებულო</span>
              </div>
              <div
                className={`flex items-center mr-4 ${
                  validation.avatar.touched && !validation.avatar.validType
                    ? "text-red-500"
                    : validation.avatar.validType
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.avatar.validType ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>სურათის ტიპი</span>
              </div>
              <div
                className={`flex items-center ${
                  validation.avatar.touched && !validation.avatar.validSize
                    ? "text-red-500"
                    : validation.avatar.validSize
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.avatar.validSize ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>მაქსიმუმ 600KB</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              დეპარტამენტი
            </label>
            <select
              id="department"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8338EC] focus:border-[#8338EC] appearance-none bg-white ${
                validation.department.touched && !validation.department.valid
                  ? "border-red-500"
                  : validation.department.touched && validation.department.valid
                    ? "border-green-500"
                    : "border-gray-300"
              }`}
              value={department}
              onChange={handleDepartmentChange}
              required
              disabled={loading}
            >
              <option value="" disabled>
                აირჩიეთ დეპარტამენტი
              </option>
              {loading ? (
                <option value="" disabled>
                  იტვირთება...
                </option>
              ) : (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              )}
            </select>
            <div className="flex text-xs mt-1">
              <div
                className={`flex items-center ${
                  validation.department.touched && !validation.department.required
                    ? "text-red-500"
                    : validation.department.required
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {validation.department.required ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                <span>სავალდებულო</span>
              </div>
            </div>
          </div>

          {formSubmitted && !isFormValid() && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              გთხოვთ შეავსოთ ყველა სავალდებულო ველი სწორად
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-6">
            <button
              type="button"
              className="px-4 py-2 text-[#212529] border border-gray-300 rounded hover:bg-gray-50"
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded ${
                isFormValid() ? "bg-[#8338EC] hover:bg-[#7029d6]" : "bg-[#8338EC]/70 cursor-not-allowed"
              }`}
            >
              დაამატე თანამშრომელი
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

