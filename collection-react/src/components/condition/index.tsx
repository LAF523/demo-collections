// src/ConditionBuilder.js

import { Select } from 'antd';
import { useState } from 'react';

const operators = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
  { value: 'NOT', label: 'NOT' }
];

const relations = [
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '>', label: '>' },
  { value: '>=', label: '>=' }
];

const ConditionBuilder = () => {
  const [conditions, setConditions] = useState([]);
  const [currentCondition, setCurrentCondition] = useState({
    field: '',
    relation: '',
    value: ''
  });
  const [logicOperator, setLogicOperator] = useState('');

  const addCondition = () => {
    if (currentCondition.field && currentCondition.relation && currentCondition.value) {
      setConditions([...conditions, currentCondition]);
      setCurrentCondition({ field: '', relation: '', value: '' });
    }
  };

  const handleFieldChange = e => {
    setCurrentCondition({ ...currentCondition, field: e.target.value });
  };

  const handleRelationChange = selectedOption => {
    setCurrentCondition({ ...currentCondition, relation: selectedOption.value });
  };

  const handleValueChange = e => {
    setCurrentCondition({ ...currentCondition, value: e.target.value });
  };

  const handleLogicOperatorChange = selectedOption => {
    setLogicOperator(selectedOption.value);
  };

  return (
    <div>
      <h3>条件构建器</h3>
      <div>
        <input
          type="text"
          placeholder="字段"
          value={currentCondition.field}
          onChange={handleFieldChange}
        />
        <Select
          options={relations}
          onChange={handleRelationChange}
          value={relations.find(rel => rel.value === currentCondition.relation)}
        />
        <input
          type="text"
          placeholder="值"
          value={currentCondition.value}
          onChange={handleValueChange}
        />
        <button onClick={addCondition}>添加条件</button>
      </div>

      <div>
        <Select
          options={operators}
          onChange={handleLogicOperatorChange}
          value={operators.find(op => op.value === logicOperator)}
        />
      </div>

      <div>
        <h4>条件列表</h4>
        <ul>
          {conditions.map((cond, index) => (
            <li key={index}>
              {cond.field} {cond.relation} {cond.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConditionBuilder;
