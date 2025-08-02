"use client";
import { useState } from 'react';
import styles from './page.module.css';
import { Icon } from '../components/Icon';

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    description: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleViewPDF = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleDownloadPDF = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();

      doc.setFont('helvetica');

      let yPosition = 30;
      const lineHeight = 12;
      const labelWidth = 35;
      const valueX = 65;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const availableWidth = pageWidth - valueX - margin;

      doc.setFontSize(12);

      doc.setFont('helvetica', 'bold');
      doc.text('Name:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.name || 'John Doe', valueX, yPosition);
      yPosition += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Email:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.email || 'Johndoe@gmail.com', valueX, yPosition);
      yPosition += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Phone Number:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.phone || '+222 223 2221', valueX, yPosition);
      yPosition += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Position:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.position || 'Junior Frontend Developer', valueX, yPosition);
      yPosition += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Description:', margin, yPosition);
      doc.setFont('helvetica', 'normal');

      const description = formData.description || 'Frontend Developer with 3 years of experience in creating responsive and user-friendly web interfaces using HTML, CSS, and JavaScript. Skilled in modern frameworks like React and committed to delivering clean, efficient code.';

      const splitText = doc.splitTextToSize(description, availableWidth);
      doc.text(splitText, valueX, yPosition);

      doc.save(`${formData.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  if (showPreview) {
    return (
      <div className={styles.previewContainer}>
        <button className={styles.backButton} onClick={handleBackToForm}>
          <Icon name="chevron-left" className={styles.icon} useFile={true} />
        </button>
        <div className={styles.pdfPreview}>
          <div className={styles.resumeCard}>
            <div className={styles.resumeContent}>
              <div className={styles.field}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{formData.name || 'John Doe'}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{formData.email || 'Johndoe@gmail.com'}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Phone Number:</span>
                <span className={styles.value}>{formData.phone || '+222 223 2221'}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Position:</span>
                <span className={styles.value}>{formData.position || 'Junior Frontend Developer'}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Description:</span>
                <span className={styles.value}>
                  {formData.description || 'Frontend Developer with 3 years of experience in creating responsive and user-friendly web interfaces using HTML, CSS, and JavaScript. Skilled in modern frameworks like React and committed to delivering clean, efficient code.'}
                </span>
              </div>
            </div>
          </div>
          <button className={styles.downloadButton2} onClick={handleDownloadPDF}>
            <span className={styles.downloadIcon}>
              <Icon name="Download" className={styles.icon} useFile={true} />
            </span>
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Your details</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <div className={styles.iconWrapper}>
              <Icon name="user" className={styles.icon} useFile={true} />
            </div>
            <div className={styles.inputContent}>
              <label className={styles.inputLabel}>Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <div className={styles.iconWrapper}>
              <Icon name="mail" className={styles.icon} useFile={true} />
            </div>
            <div className={styles.inputContent}>
              <label className={styles.inputLabel}>Email</label>
              <input
                type="email"
                placeholder="e.g. Johndoe@gmail.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <div className={styles.iconWrapper}>
              <Icon name="phone" className={styles.icon} useFile={true} />
            </div>
            <div className={styles.inputContent}>
              <label className={styles.inputLabel}>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. (220) 222 -20002"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <div className={styles.iconWrapper}>
              <Icon name="position" className={styles.icon} useFile={true} />
            </div>
            <div className={styles.inputContent}>
              <label className={styles.inputLabel}>Position</label>
              <input
                type="text"
                placeholder="e.g. Junior Front end Developer"
                className={styles.input}
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <div className={styles.iconWrapper}>
              <Icon name="Description" className={styles.icon} useFile={true} />
            </div>
            <div className={styles.inputContent}>
              <label className={styles.inputLabel}>Description</label>
              <textarea
                placeholder="e.g. Work experiences"
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.viewButton} onClick={handleViewPDF}>
            <span className={styles.viewIcon}>
              <Icon name="view" className={styles.icon} useFile={true} />
            </span>
            View PDF
          </button>
          <button className={styles.downloadButton} onClick={handleDownloadPDF}>
            <span className={styles.downloadIcon}>
              <Icon name="Download" className={styles.icon} useFile={true} />
            </span>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
