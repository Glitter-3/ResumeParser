import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Plus, Sparkles, GraduationCap, Briefcase, Award, Code2 } from 'lucide-react';

const ResumeParser = () => {
  // ========== 状态管理 ==========
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState(''); // 'success' | 'error' | ''
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ========== 表单数据结构 ==========
  const emptyFormData = {
    basicInfo: {
      name: '',
      email: '',
      phone: '',
      nationality: '',
      location: ''
    },
    education: [{
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }],
    internships: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    research: [{
      title: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    awards: [{
      name: '',
      level: '',
      date: '',
      description: ''
    }],
    skills: []
  };

  const [formData, setFormData] = useState(emptyFormData);
  const [newSkill, setNewSkill] = useState('');

  // ========== 文件处理函数 ==========
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

  const handleFileSelect = (selectedFile) => {
    setErrorMessage('');
    setParseStatus('');
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
  };

  const handleParse = async () => {
    if (!file) {
      setErrorMessage('请先上传简历文件');
      return;
    }

    setIsParsing(true);
    setParseStatus('');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟解析成功的数据
      const mockParsedData = {
        basicInfo: {
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '+86 138-0000-0000',
          nationality: '中国',
          location: '北京市朝阳区'
        },
        education: [
          {
            school: '清华大学',
            degree: '计算机科学与技术',
            startDate: '2019-09',
            endDate: '2023-06',
            gpa: '3.8/4.0'
          }
        ],
        internships: [
          {
            company: '字节跳动',
            position: '前端开发实习生',
            startDate: '2022-06',
            endDate: '2022-09',
            description: '负责抖音Web端功能开发，优化页面性能，参与组件库建设'
          }
        ],
        research: [
          {
            title: '基于深度学习的图像识别研究',
            role: '主要参与者',
            startDate: '2021-09',
            endDate: '2022-06',
            description: '研究卷积神经网络在图像分类任务中的应用'
          }
        ],
        awards: [
          {
            name: 'ACM程序设计竞赛',
            level: '省级一等奖',
            date: '2021-10',
            description: '在省级ACM竞赛中获得一等奖'
          }
        ],
        skills: ['JavaScript', 'React', 'Python', 'Machine Learning', 'Node.js']
      };

      setFormData(mockParsedData);
      setParseStatus('success');
    } catch (error) {
      setParseStatus('error');
      setErrorMessage('解析失败，请重试');
    } finally {
      setIsParsing(false);
    }
  };

  const handleReupload = () => {
    setFile(null);
    setUploadProgress(0);
    setParseStatus('');
    setErrorMessage('');
    setFormData(emptyFormData);
  };

  // ========== 拖放事件处理 ==========
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

  // ========== 表单数据更新函数 ==========
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

  // 添加新的项目（教育、实习等）
  const addItem = (section) => {
    const templates = {
      education: { school: '', degree: '', startDate: '', endDate: '', gpa: '' },
      internships: { company: '', position: '', startDate: '', endDate: '', description: '' },
      research: { title: '', role: '', startDate: '', endDate: '', description: '' },
      awards: { name: '', level: '', date: '', description: '' }
    };

    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  // 删除项目
  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // 添加技能
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // 删除技能
  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // ========== 组件渲染 ==========
  return (
    <div className="resume-parser-container">
      {/* 背景装饰效果 */}
      <div className="background-decoration">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="resume-parser-wrapper">
        {/* 页面标题 */}
        <div className="resume-parser-header">
          <h1 className="resume-parser-title">
            <span className="gradient-text">简历上传与解析</span>
          </h1>
        </div>

        {/* 上传区域 */}
        <div className="upload-section">
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
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
              style={{ display: 'none' }}
            />

            {!file ? (
              <div className="upload-content">
                <div className="upload-icon-wrapper">
                  <Upload className="upload-icon" size={40} />
                </div>
                <h3 className="upload-title">拖放简历文件至此处</h3>
                <p className="upload-text">或点击选择文件</p>
                <div className="file-types">
                  <span className="file-type">PDF</span>
                  <span className="file-type">DOCX</span>
                </div>
                <span className="upload-hint">文件大小不超过 2MB</span>
              </div>
            ) : (
              <div className="file-info">
                <div className="file-icon-wrapper">
                  <FileText className="file-icon" size={32} />
                </div>
                <div className="file-details">
                  <h4 className="file-name">{file.name}</h4>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {!isParsing && (
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReupload();
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 上传进度 */}
          {isUploading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {/* 错误提示 */}
          {errorMessage && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 操作按钮 - 始终显示 */}
          <div className="action-buttons">
            <button 
              className={`primary-button ${isParsing ? 'loading' : ''} ${parseStatus === 'success' ? 'success' : ''}`}
              onClick={handleParse}
              disabled={isParsing}
            >
              {isParsing ? (
                <>
                  <Loader2 className="spinning" size={18} />
                  解析中...
                </>
              ) : parseStatus === 'success' ? (
                <>
                  <CheckCircle size={18} />
                  解析成功
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  开始解析
                </>
              )}
            </button>
            <button 
              className="secondary-button"
              onClick={handleReupload}
            >
              重新上传
            </button>
          </div>
        </div>

        {/* 解析结果/表单区域 */}
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">个人信息填写</h2>
            {!file && (
              <div className="form-hint">
                <Sparkles size={14} />
                <span>建议上传简历以自动填充信息</span>
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <FileText size={20} />
              </div>
              <h3 className="section-title">基本信息</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.basicInfo.name}
                  onChange={(e) => updateFormData('basicInfo', 'name', e.target.value)}
                  placeholder="请输入姓名"
                />
              </div>
              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.basicInfo.email}
                  onChange={(e) => updateFormData('basicInfo', 'email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">电话</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.basicInfo.phone}
                  onChange={(e) => updateFormData('basicInfo', 'phone', e.target.value)}
                  placeholder="+86 138-0000-0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">国籍</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.basicInfo.nationality}
                  onChange={(e) => updateFormData('basicInfo', 'nationality', e.target.value)}
                  placeholder="中国"
                />
              </div>
              <div className="form-group">
                <label className="form-label">所在地</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.basicInfo.location}
                  onChange={(e) => updateFormData('basicInfo', 'location', e.target.value)}
                  placeholder="城市，省份"
                />
              </div>
            </div>
          </div>

          {/* 教育经历 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <GraduationCap size={20} />
              </div>
              <h3 className="section-title">教育经历</h3>
              <button 
                className="add-button"
                onClick={() => addItem('education')}
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="form-item">
                <div className="item-header">
                  <span className="item-number">{index + 1}</span>
                  {formData.education.length > 1 && (
                    <button
                      className="delete-button"
                      onClick={() => removeItem('education', index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">学校</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.school}
                      onChange={(e) => updateFormData('education', 'school', e.target.value, index)}
                      placeholder="学校名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">专业</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.degree}
                      onChange={(e) => updateFormData('education', 'degree', e.target.value, index)}
                      placeholder="专业名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">开始时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={edu.startDate}
                      onChange={(e) => updateFormData('education', 'startDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">结束时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={edu.endDate}
                      onChange={(e) => updateFormData('education', 'endDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GPA</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.gpa}
                      onChange={(e) => updateFormData('education', 'gpa', e.target.value, index)}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 实习经历 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Briefcase size={20} />
              </div>
              <h3 className="section-title">实习经历</h3>
              <button 
                className="add-button"
                onClick={() => addItem('internships')}
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            {formData.internships.map((intern, index) => (
              <div key={index} className="form-item">
                <div className="item-header">
                  <span className="item-number">{index + 1}</span>
                  {formData.internships.length > 1 && (
                    <button
                      className="delete-button"
                      onClick={() => removeItem('internships', index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">公司</label>
                    <input
                      type="text"
                      className="form-input"
                      value={intern.company}
                      onChange={(e) => updateFormData('internships', 'company', e.target.value, index)}
                      placeholder="公司名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">职位</label>
                    <input
                      type="text"
                      className="form-input"
                      value={intern.position}
                      onChange={(e) => updateFormData('internships', 'position', e.target.value, index)}
                      placeholder="职位名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">开始时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={intern.startDate}
                      onChange={(e) => updateFormData('internships', 'startDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">结束时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={intern.endDate}
                      onChange={(e) => updateFormData('internships', 'endDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">
                      描述
                      <span className="char-count">{intern.description.length}/100</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      value={intern.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateFormData('internships', 'description', e.target.value, index);
                        }
                      }}
                      placeholder="简要描述工作内容（100字以内）"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 科研经历 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Award size={20} />
              </div>
              <h3 className="section-title">科研经历</h3>
              <button 
                className="add-button"
                onClick={() => addItem('research')}
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            {formData.research.map((res, index) => (
              <div key={index} className="form-item">
                <div className="item-header">
                  <span className="item-number">{index + 1}</span>
                  {formData.research.length > 1 && (
                    <button
                      className="delete-button"
                      onClick={() => removeItem('research', index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">项目名称</label>
                    <input
                      type="text"
                      className="form-input"
                      value={res.title}
                      onChange={(e) => updateFormData('research', 'title', e.target.value, index)}
                      placeholder="研究项目名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">角色</label>
                    <input
                      type="text"
                      className="form-input"
                      value={res.role}
                      onChange={(e) => updateFormData('research', 'role', e.target.value, index)}
                      placeholder="主要参与者"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">开始时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={res.startDate}
                      onChange={(e) => updateFormData('research', 'startDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">结束时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={res.endDate}
                      onChange={(e) => updateFormData('research', 'endDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">
                      描述
                      <span className="char-count">{res.description.length}/100</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      value={res.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateFormData('research', 'description', e.target.value, index);
                        }
                      }}
                      placeholder="简要描述研究内容（100字以内）"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 竞赛荣誉 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Award size={20} />
              </div>
              <h3 className="section-title">竞赛荣誉</h3>
              <button 
                className="add-button"
                onClick={() => addItem('awards')}
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            {formData.awards.map((award, index) => (
              <div key={index} className="form-item">
                <div className="item-header">
                  <span className="item-number">{index + 1}</span>
                  {formData.awards.length > 1 && (
                    <button
                      className="delete-button"
                      onClick={() => removeItem('awards', index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">奖项名称</label>
                    <input
                      type="text"
                      className="form-input"
                      value={award.name}
                      onChange={(e) => updateFormData('awards', 'name', e.target.value, index)}
                      placeholder="竞赛或奖项名称"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">级别</label>
                    <input
                      type="text"
                      className="form-input"
                      value={award.level}
                      onChange={(e) => updateFormData('awards', 'level', e.target.value, index)}
                      placeholder="国家级/省级/校级"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">获奖时间</label>
                    <input
                      type="date"
                      className="form-input"
                      value={award.date}
                      onChange={(e) => updateFormData('awards', 'date', e.target.value, index)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">
                      描述
                      <span className="char-count">{award.description.length}/100</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      value={award.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateFormData('awards', 'description', e.target.value, index);
                        }
                      }}
                      placeholder="简要描述获奖情况（100字以内）"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 技能特长 */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Code2 size={20} />
              </div>
              <h3 className="section-title">技能特长</h3>
            </div>
            <div className="skills-section">
              <div className="skills-input-wrapper">
                <input
                  type="text"
                  className="form-input skill-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="输入技能名称，按回车添加"
                />
                <button 
                  className="add-skill-button"
                  onClick={addSkill}
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="skills-container">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <X 
                      className="skill-remove" 
                      size={14} 
                      onClick={() => removeSkill(index)}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ========== 全局样式 ========== */
        .resume-parser-container {
          min-height: 100vh;
          background: #000000;
          color: #ffffff;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ========== 背景装饰 ========== */
        .background-decoration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #22c55e 0%, transparent 70%);
          top: -300px;
          left: -300px;
          animation: float 20s ease-in-out infinite;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #10b981 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          animation: float 25s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }

        .resume-parser-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ========== 头部样式 ========== */
        .resume-parser-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInDown 0.8s ease-out;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          color: #22c55e;
          margin-bottom: 24px;
        }

        .resume-parser-title {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .resume-parser-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 20px;
          line-height: 1.6;
        }

        /* ========== 上传区域样式 ========== */
        .upload-section {
          max-width: 600px;
          margin: 0 auto 80px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .upload-area {
          background: rgba(255, 255, 255, 0.02);
          border: 2px dashed rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(10px);
        }

        .upload-area:hover {
          border-color: rgba(34, 197, 94, 0.6);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }

        .upload-area.dragging {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
          transform: scale(1.02);
        }

        .upload-area.has-file {
          padding: 24px;
          cursor: default;
        }

        .upload-area.has-file:hover {
          transform: none;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .upload-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .upload-icon {
          color: #22c55e;
        }

        .upload-title {
          font-size: 22px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .upload-text {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .file-types {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .file-type {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .upload-hint {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ========== 文件信息样式 ========== */
        .file-info {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(34, 197, 94, 0.05);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .file-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-icon {
          color: #22c55e;
        }

        .file-details {
          flex: 1;
          text-align: left;
        }

        .file-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #ffffff;
        }

        .file-size {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 0;
        }

        .remove-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-button:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        /* ========== 进度条样式 ========== */
        .progress-container {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #10b981 100%);
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .progress-text {
          color: #22c55e;
          font-weight: 600;
          min-width: 50px;
          text-align: right;
          font-size: 14px;
        }

        /* ========== 错误提示样式 ========== */
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* ========== 按钮样式 ========== */
        .action-buttons {
          display: flex;
          gap: 16px;
          margin-top: 24px;
          justify-content: center;
        }

        .primary-button, .secondary-button {
          padding: 12px 28px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .primary-button {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          color: #000000;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        .primary-button:active {
          transform: translateY(0);
        }

        .primary-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .primary-button.loading {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
        }

        .primary-button.success {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
        }

        .secondary-button {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ========== 表单区域样式 ========== */
        .form-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
        }

        .form-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .form-hint svg {
          color: #22c55e;
        }

        /* ========== 表单区块样式 ========== */
        .form-section {
          margin-bottom: 48px;
          padding: 32px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          flex: 1;
        }

        .add-button {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .add-button:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.5);
        }

        /* ========== 表单项样式 ========== */
        .form-item {
          background: rgba(255, 255, 255, 0.02);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .item-number {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #22c55e;
        }

        .delete-button {
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          color: rgba(239, 68, 68, 0.8);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-button:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-input, .form-textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #ffffff;
          font-size: 16px;
          transition: all 0.3s;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: rgba(34, 197, 94, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        /* 日期输入框的特殊样式 */
        .form-input[type="date"] {
          color: rgba(255, 255, 255, 0.3);
        }

        .form-input[type="date"]:focus {
          color: #ffffff;
        }

        .form-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          opacity: 0.5;
        }

        .form-input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
          line-height: 1.5;
        }

        /* ========== 技能标签样式 ========== */
        .skills-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .skills-input-wrapper {
          display: flex;
          gap: 12px;
        }

        .skill-input {
          flex: 1;
        }

        .add-skill-button {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          cursor: pointer;
          color: #000000;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-skill-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-tag {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .skill-tag:hover {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .skill-remove {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .skill-remove:hover {
          opacity: 1;
        }

        /* ========== 动画 ========== */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== 响应式设计 ========== */
        @media (max-width: 768px) {
          .resume-parser-title {
            font-size: 36px;
          }

          .resume-parser-subtitle {
            font-size: 16px;
          }

          .upload-area {
            padding: 24px;
          }

          .form-wrapper {
            padding: 24px;
          }

          .form-section {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
          }

          .primary-button, .secondary-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeParser;