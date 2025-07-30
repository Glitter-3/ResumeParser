import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, User, ArrowRight, Camera } from 'lucide-react';

console.log('ResumeParser 版本2 已加载');
const ResumeParser = () => {
  // 步骤管理
  const [currentStep, setCurrentStep] = useState('personal'); // 'personal' | 'upload' | 'details'
  
  // Personal Information 状态
  const [avatar, setAvatar] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  
  // 文件上传状态
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // 详细信息表单数据
  const [formData, setFormData] = useState({
    basicInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      country: '',
      city: '',
      profileSummary: ''
    },
    education: [],
    internships: [],
    research: [],
    awards: [],
    skills: []
  });

  // 处理头像上传
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 验证个人信息是否完整
  const isPersonalInfoComplete = () => {
    return personalInfo.firstName && personalInfo.lastName && 
           personalInfo.phone && personalInfo.email;
  };

  // 处理进入下一步
  const handleNextStep = () => {
    if (currentStep === 'personal' && isPersonalInfoComplete()) {
      // 将个人信息同步到详细表单
      setFormData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          email: personalInfo.email
        }
      }));
      setCurrentStep('upload');
    }
  };

  // 文件验证
  const validateFile = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.docx'];

    if (file.size > maxSize) {
      setErrorMessage('文件大小不能超过2MB');
      return false;
    }

    const extension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension) || !allowedTypes.includes(file.type)) {
      setErrorMessage('仅支持 PDF 和 DOCX 格式');
      return false;
    }

    return true;
  };

  // 处理文件选择
  const handleFileSelect = (selectedFile) => {
    setErrorMessage('');
    setParseStatus('');
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  // 模拟文件上传
  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
  };

  // 模拟简历解析
  const handleParse = async () => {
    setIsParsing(true);
    setParseStatus('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟解析成功的数据，保留用户已填写的个人信息
      const mockParsedData = {
        basicInfo: {
          ...formData.basicInfo,
          country: '中国',
          city: '北京',
          profileSummary: '热爱技术的全栈开发者'
        },
        education: [
          {
            school: '清华大学',
            degree: '计算机科学与技术',
            period: '2019.09 - 2023.06',
            gpa: '3.8/4.0'
          }
        ],
        internships: [
          {
            company: '字节跳动',
            position: '前端开发实习生',
            period: '2022.06 - 2022.09',
            description: '负责抖音Web端功能开发'
          }
        ],
        research: [
          {
            title: '基于深度学习的图像识别研究',
            role: '主要参与者',
            period: '2021.09 - 2022.06'
          }
        ],
        awards: [
          {
            name: 'ACM程序设计竞赛',
            level: '省级一等奖',
            date: '2021.10'
          }
        ],
        skills: ['JavaScript', 'React', 'Python', 'Machine Learning']
      };

      setFormData(mockParsedData);
      setParseStatus('success');
      
      // 解析成功后自动跳转到详细信息页
      setTimeout(() => {
        setCurrentStep('details');
      }, 1000);
    } catch (error) {
      setParseStatus('error');
      setErrorMessage('解析失败，请重试');
    } finally {
      setIsParsing(false);
    }
  };

  // 重新上传
  const handleReupload = () => {
    setFile(null);
    setUploadProgress(0);
    setParseStatus('');
    setErrorMessage('');
  };

  // 拖放事件处理
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // 更新表单数据
  const updateFormData = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== null) {
        newData[section][index][field] = value;
      } else if (section === 'basicInfo') {
        newData.basicInfo[field] = value;
      } else {
        newData[section] = value;
      }
      return newData;
    });
  };

  // 添加新项目
  const addItem = (section) => {
    const templates = {
      education: { school: '', degree: '', period: '', gpa: '' },
      internships: { company: '', position: '', period: '', description: '' },
      research: { title: '', role: '', period: '' },
      awards: { name: '', level: '', date: '' }
    };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  // Personal Information 页面
  const PersonalInformationPage = () => (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e8e8e8] p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
            Personal Information
          </h1>
          <p className="text-[#9ca3af] text-lg">请先填写您的基本信息</p>
        </div>

        <div className="bg-[#1a1f2e] rounded-2xl p-10">
          {/* 头像上传 */}
          <div className="flex justify-center mb-10">
            <div 
              className="relative w-32 h-32 bg-[#0f172a] rounded-2xl border-2 border-dashed border-[#374151] hover:border-[#4ade80] transition-all cursor-pointer overflow-hidden group"
              onClick={() => avatarInputRef.current?.click()}
            >
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="w-8 h-8 text-[#4ade80] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-[#6b7280]">上传头像</span>
                </div>
              )}
            </div>
          </div>

          {/* 必填信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#9ca3af] text-sm font-medium mb-2">
                First Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="请输入名字"
                className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] text-sm font-medium mb-2">
                Last Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="请输入姓氏"
                className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] text-sm font-medium mb-2">
                Phone Number <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入电话号码"
                className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] text-sm font-medium mb-2">
                Email Address <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱地址"
                className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
              />
            </div>
          </div>

          {/* 下一步按钮 */}
          <div className="mt-10 flex justify-center">
            <button
              className={`
                px-12 py-4 rounded-lg font-semibold transition-all duration-300
                flex items-center gap-3 text-lg
                ${isPersonalInfoComplete()
                  ? 'bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0a0e1a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4ade80]/30'
                  : 'bg-[#374151] text-[#6b7280] cursor-not-allowed'
                }
              `}
              onClick={handleNextStep}
              disabled={!isPersonalInfoComplete()}
            >
              下一步
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Resume Upload 页面
  const ResumeUploadPage = () => (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e8e8e8] p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
            Resume Parser
          </h1>
          <p className="text-[#9ca3af] text-lg">上传您的简历，我们将自动提取信息</p>
        </div>

        {/* 上传区域 */}
        <div
          className={`
            relative bg-[#1a1f2e] border-2 border-dashed rounded-2xl p-16 text-center
            transition-all duration-300 cursor-pointer
            ${isDragging ? 'border-[#4ade80] bg-[#1f2937] scale-[1.02]' : 'border-[#374151] hover:border-[#4ade80] hover:bg-[#1f2937]'}
            ${file ? 'p-8 cursor-default hover:scale-100' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {!file ? (
            <>
              <Upload className="w-12 h-12 text-[#4ade80] mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">拖放简历文件至此处</h3>
              <p className="text-[#9ca3af] mb-4">或点击选择文件</p>
              <span className="text-sm text-[#6b7280]">支持 PDF、DOCX 格式，文件大小不超过 2MB</span>
            </>
          ) : (
            <div className="flex items-center gap-5 bg-[#0f172a] p-5 rounded-xl">
              <FileText className="w-10 h-10 text-[#4ade80] flex-shrink-0" />
              <div className="flex-1 text-left">
                <h4 className="text-lg font-medium mb-1">{file.name}</h4>
                <p className="text-[#9ca3af] text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!isParsing && (
                <button
                  className="p-2 bg-[#374151] hover:bg-[#ef4444] rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReupload();
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 上传进度 */}
        {isUploading && (
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 h-2 bg-[#374151] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[#4ade80] font-semibold min-w-[50px] text-right">{uploadProgress}%</span>
          </div>
        )}

        {/* 错误提示 */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 bg-[#7f1d1d] text-[#ef4444] p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* 操作按钮 */}
        {file && !isUploading && (
          <div className="mt-8 flex gap-4 justify-center">
            <button 
              className={`
                px-8 py-3 rounded-lg font-semibold transition-all duration-300
                flex items-center gap-2
                ${isParsing || parseStatus === 'success' 
                  ? 'bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0a0e1a] opacity-70 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0a0e1a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4ade80]/30'
                }
              `}
              onClick={handleParse}
              disabled={isParsing || parseStatus === 'success'}
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  解析中...
                </>
              ) : parseStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  解析成功
                </>
              ) : (
                '开始解析'
              )}
            </button>
            <button 
              className="px-8 py-3 bg-[#374151] hover:bg-[#4b5563] text-[#e8e8e8] rounded-lg font-semibold transition-colors duration-300"
              onClick={handleReupload}
            >
              重新上传
            </button>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="mt-10 flex justify-center">
          <button
            className="text-[#9ca3af] hover:text-[#4ade80] transition-colors"
            onClick={() => setCurrentStep('personal')}
          >
            ← 返回上一步
          </button>
        </div>
      </div>
    </div>
  );

  // Details 页面
  const DetailsPage = () => (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e8e8e8] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
            完善信息
          </h1>
          <p className="text-[#9ca3af] text-lg">请确认并完善您的详细信息</p>
        </div>

        <div className="bg-[#1a1f2e] rounded-2xl p-10">
          {/* 基本信息 */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-[#4ade80] mb-6 pb-3 border-b border-[#374151]">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.basicInfo.firstName}
                  onChange={(e) => updateFormData('basicInfo', 'firstName', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.basicInfo.lastName}
                  onChange={(e) => updateFormData('basicInfo', 'lastName', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.basicInfo.phone}
                  onChange={(e) => updateFormData('basicInfo', 'phone', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.basicInfo.email}
                  onChange={(e) => updateFormData('basicInfo', 'email', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.basicInfo.country}
                  onChange={(e) => updateFormData('basicInfo', 'country', e.target.value)}
                  placeholder="请输入国家"
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.basicInfo.city}
                  onChange={(e) => updateFormData('basicInfo', 'city', e.target.value)}
                  placeholder="请输入城市"
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#9ca3af] text-sm font-medium mb-2">
                  Profile Summary <span className="text-[#6b7280] text-xs">(最多30字)</span>
                </label>
                <textarea
                  value={formData.basicInfo.profileSummary}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) {
                      updateFormData('basicInfo', 'profileSummary', e.target.value);
                    }
                  }}
                  placeholder="简短介绍自己"
                  rows={2}
                  className="w-full bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all resize-none"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.basicInfo.profileSummary.length > 25 ? 'text-[#ef4444]' : 'text-[#6b7280]'}`}>
                    {formData.basicInfo.profileSummary.length}/30
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 教育经历 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#374151]">
              <h3 className="text-xl font-semibold text-[#4ade80]">教育经历</h3>
              <button
                onClick={() => addItem('education')}
                className="text-[#4ade80] hover:text-[#22c55e] transition-colors text-sm font-medium"
              >
                + 添加教育经历
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-[#0f172a] p-6 rounded-xl mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">学校</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateFormData('education', 'school', e.target.value, index)}
                      placeholder="学校名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">专业</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateFormData('education', 'degree', e.target.value, index)}
                      placeholder="专业名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">时间</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateFormData('education', 'period', e.target.value, index)}
                      placeholder="如：2019.09 - 2023.06"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateFormData('education', 'gpa', e.target.value, index)}
                      placeholder="如：3.8/4.0"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 实习经历 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#374151]">
              <h3 className="text-xl font-semibold text-[#4ade80]">实习经历</h3>
              <button
                onClick={() => addItem('internships')}
                className="text-[#4ade80] hover:text-[#22c55e] transition-colors text-sm font-medium"
              >
                + 添加实习经历
              </button>
            </div>
            {formData.internships.map((intern, index) => (
              <div key={index} className="bg-[#0f172a] p-6 rounded-xl mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">公司</label>
                    <input
                      type="text"
                      value={intern.company}
                      onChange={(e) => updateFormData('internships', 'company', e.target.value, index)}
                      placeholder="公司名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">职位</label>
                    <input
                      type="text"
                      value={intern.position}
                      onChange={(e) => updateFormData('internships', 'position', e.target.value, index)}
                      placeholder="职位名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">时间</label>
                    <input
                      type="text"
                      value={intern.period}
                      onChange={(e) => updateFormData('internships', 'period', e.target.value, index)}
                      placeholder="如：2022.06 - 2022.09"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">描述</label>
                    <textarea
                      value={intern.description}
                      onChange={(e) => updateFormData('internships', 'description', e.target.value, index)}
                      placeholder="工作内容描述"
                      rows={3}
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 科研经历 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#374151]">
              <h3 className="text-xl font-semibold text-[#4ade80]">科研经历</h3>
              <button
                onClick={() => addItem('research')}
                className="text-[#4ade80] hover:text-[#22c55e] transition-colors text-sm font-medium"
              >
                + 添加科研经历
              </button>
            </div>
            {formData.research.map((res, index) => (
              <div key={index} className="bg-[#0f172a] p-6 rounded-xl mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">项目名称</label>
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => updateFormData('research', 'title', e.target.value, index)}
                      placeholder="研究项目名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">角色</label>
                    <input
                      type="text"
                      value={res.role}
                      onChange={(e) => updateFormData('research', 'role', e.target.value, index)}
                      placeholder="如：主要参与者"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">时间</label>
                    <input
                      type="text"
                      value={res.period}
                      onChange={(e) => updateFormData('research', 'period', e.target.value, index)}
                      placeholder="如：2021.09 - 2022.06"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 竞赛荣誉 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#374151]">
              <h3 className="text-xl font-semibold text-[#4ade80]">竞赛荣誉</h3>
              <button
                onClick={() => addItem('awards')}
                className="text-[#4ade80] hover:text-[#22c55e] transition-colors text-sm font-medium"
              >
                + 添加竞赛荣誉
              </button>
            </div>
            {formData.awards.map((award, index) => (
              <div key={index} className="bg-[#0f172a] p-6 rounded-xl mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">奖项名称</label>
                    <input
                      type="text"
                      value={award.name}
                      onChange={(e) => updateFormData('awards', 'name', e.target.value, index)}
                      placeholder="竞赛或奖项名称"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">获奖等级</label>
                    <input
                      type="text"
                      value={award.level}
                      onChange={(e) => updateFormData('awards', 'level', e.target.value, index)}
                      placeholder="如：省级一等奖"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9ca3af] text-sm font-medium mb-2">获奖时间</label>
                    <input
                      type="text"
                      value={award.date}
                      onChange={(e) => updateFormData('awards', 'date', e.target.value, index)}
                      placeholder="如：2021.10"
                      className="w-full bg-[#1a1f2e] border border-[#374151] rounded-lg px-4 py-3 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 技能特长 */}
          <div>
            <h3 className="text-xl font-semibold text-[#4ade80] mb-6 pb-3 border-b border-[#374151]">技能特长</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-[#374151] text-[#4ade80] px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-[#4b5563] transition-colors">
                  {skill}
                  <X 
                    className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" 
                    onClick={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== index);
                      updateFormData('skills', null, newSkills);
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="添加技能"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    updateFormData('skills', null, [...formData.skills, e.target.value.trim()]);
                    e.target.value = '';
                  }
                }}
                className="flex-1 bg-[#0f172a] border border-[#374151] rounded-lg px-4 py-2 text-[#e8e8e8] focus:outline-none focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
              />
              <button
                className="px-4 py-2 bg-[#374151] hover:bg-[#4b5563] text-[#e8e8e8] rounded-lg transition-colors"
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  if (input.value.trim()) {
                    updateFormData('skills', null, [...formData.skills, input.value.trim()]);
                    input.value = '';
                  }
                }}
              >
                添加
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="mt-12 flex justify-center gap-4">
            <button
              className="px-8 py-3 bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0a0e1a] rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4ade80]/30 transition-all duration-300"
            >
              保存信息
            </button>
            <button
              className="px-8 py-3 bg-[#374151] hover:bg-[#4b5563] text-[#e8e8e8] rounded-lg font-semibold transition-colors duration-300"
              onClick={() => setCurrentStep('upload')}
            >
              重新上传简历
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 根据当前步骤渲染对应页面
  return (
    <>
      {currentStep === 'personal' && <PersonalInformationPage />}
      {currentStep === 'upload' && <ResumeUploadPage />}
      {currentStep === 'details' && <DetailsPage />}
    </>
  );
};

export default ResumeParser;