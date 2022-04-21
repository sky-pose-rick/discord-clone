import styled from 'styled-components';

const FormBox = styled.div`{
  background-color: #363940;
  color: #9c9fa6;
  margin: 20px 20px;
  padding: 10px 40px;
  width: 400px;
}`;

const FormH1 = styled.h1`{
  color: white;
}`;

const LabelWrapper = styled.div`{
  display: flex;
  flex-direction: column;
  margin: 5px;
  gap: 5px;
}`;

const InputWrapper = styled.div`{
  display: flex;
}`;

const FormInput = styled.input`{
  width: 100%;
}`;

export default {
  FormBox,
  FormH1,
  LabelWrapper,
  InputWrapper,
  FormInput,
};
