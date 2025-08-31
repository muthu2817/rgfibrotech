'use client';
import { useState } from 'react';
import InputField from './FormComponents/Input';
import axiosInstance from '@/app/API/axiosInterceptor';
import StatusMessage from '../StatusMsg';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import { useDispatch } from 'react-redux';
import Popup from '../Popup';

const WorkflowForm = ({ setRefresh, isFormOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stages: [
      {
        stage: 'rnd',
        sequence: 1,
        estimatedDuration: ''
      },
      {
        stage: 'moudling',
        sequence: 2,
        estimatedDuration: ''
      },
      {
        stage: 'assembly',
        sequence: 3,
        estimatedDuration: ''
      },
      {
        stage: 'finishing',
        sequence: 4,
        estimatedDuration: ''
      },
      {
        stage: 'pdi',
        sequence: 5,
        estimatedDuration: ''
      },
      {
        stage: 'dispatch',
        sequence: 6,
        estimatedDuration: ''
      },

    ]
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const dispatch = useDispatch();

  const closeForm = () => {
    dispatch(setFormOpen(false));
  };

  const InputFieldConfig = [
    {
      label: "name",
      Placeholder: "Enter Workflow Name"
    },
    {
      label: "description",
      Placeholder: "Enter Description"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/workflow-templates', formData);
      setStatusMsg({
        message: res.data.message || 'Workflow Template Created Successfully!',
        type: 'success',
      });
      setTimeout(() => {
        closeForm();
      }, 1000);
      setRefresh && setRefresh(prev => !prev);
    } catch (err) {
      setStatusMsg({
        message: err.response?.data?.message || 'Something went wrong!',
        type: 'error',
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStageChange = (index, field, value) => {
    setFormData(prev => {
      const newStages = [...prev.stages];
      newStages[index] = {
        ...newStages[index],
        [field]: value
      };
      return {
        ...prev,
        stages: newStages
      };
    });
  };

  const addStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          stage: '',
          sequence: prev.stages.length + 1,
          estimatedDuration: ''
        }
      ]
    }));
  };

  const removeStage = (index) => {
    setFormData(prev => {
      const newStages = prev.stages.filter((_, i) => i !== index);
      // Re-sequence
      newStages.forEach((s, idx) => s.sequence = idx + 1);
      return {
        ...prev,
        stages: newStages
      };
    });
  };

  return (
    <Popup
      isOpen={isFormOpen}
      onClose={closeForm}
      title="Create Workflow Template"
      showCloseButton={true}
      overlayClickToClose={true}
      formName="addWorkflowForm"
      size='medium'
      onCancel={closeForm}
      onSubmit={() => {}}
      cancelButtonText={'Cancel'}
      submitButtonText="Create"
    >
      <form
        id="addWorkflowForm"
        name="addWorkflowForm"
        className="relative bg-white w-full grid grid-cols-2 gap-y-3 gap-x-4"
        onSubmit={handleSubmit}
      >
        <InputField
          ItemName={'Workflow Template Name'}
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
        <div>
            <label>Status</label>
            <select
                value={formData.isActive}
                onChange={e =>
                    setFormData(prev => ({
                        ...prev,
                        isActive: e.target.value === "true"
                    }))
                }
            >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        </div>
        {
            formData.stages.map((stage, index) => {
                return (
                    <div key={index} className='bg-[#efefef] col-span-2 rounded-sm grid grid-cols-8 w-auto'>
                        <div
                            className='col-span-1 flex justify-center items-center cursor-pointer'
                            onClick={() => {
                                setFormData(prev => {
                                    const newStages = prev.stages.map((s, i) =>
                                        i === index
                                            ? { ...s, isAdded: !s.isAdded }
                                            : s
                                    );
                                    return { ...prev, stages: newStages };
                                });
                            }}
                        >
                            <div className={`w-4 h-4 rounded-full ${stage.isAdded ? 'bg-[#005ACF]' : 'bg-[#a3a3a3]'}`}></div>
                        </div>
                        <div className='col-span-4 flex items-center'>
                            <p className='text-sm font-medium capitalize'>{stage.stage}</p>
                        </div>
                        <div className='col-span-3'>
                            <input
                                type='number'
                                placeholder='Duration'
                                className='border-0 border-t-0 border-l border-l-[#c3c3c3] rounded-none focus:ring-0 focus:outline-none w-full'
                                style={{border:0,borderLeft:'1px solid #e3e3e3',borderRadius:0}}
                                value={stage.estimatedDuration}
                                onChange={e => {
                                    const value = e.target.value;
                                    setFormData(prev => {
                                        const newStages = prev.stages.map((s, i) =>
                                            i === index
                                                ? { ...s, estimatedDuration: value }
                                                : s
                                        );
                                        return { ...prev, stages: newStages };
                                    });
                                }}
                            />
                        </div>
                    </div>
                );
            })
        }
        
        <div className="col-span-2">
          {statusMsg && (
            <StatusMessage message={statusMsg.message} type={statusMsg.type} />
          )}
        </div>
        <button
          type="submit"
          className="hidden"
          aria-hidden="true"
        />
      </form>
    </Popup>
  );
};

export default WorkflowForm;