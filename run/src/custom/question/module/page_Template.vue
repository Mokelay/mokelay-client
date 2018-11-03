<script>
import multipleExaminationQuestion from './multiple_examination_question';
import multipleRadioQuestion from './multiple_radio_question';
import nameLocationQuestion from './name_location_question';
import addItemQuestion from './add_item_question';
import openQuestion from './open_question';
import compoundRadioQuestion from './compound_radio_question';
import markStarQuestion from './mark_star_question';
// import mallAddressQuestion from './mall_address_question';
export default {
  name: 'page-template',
  props: {
      pageData: {
          type: Array,
      }
  },
  data(){
    return {}
  },
  components: {
    multipleExaminationQuestion,
    multipleRadioQuestion,
    nameLocationQuestion,
    addItemQuestion,
    openQuestion,
    compoundRadioQuestion,
    markStarQuestion,
    // mallAddressQuestion,
  },
  render: function(createElement){
    var comElementList = [];
    this.pageData.map((value, index)=>{
      switch(value.type){
        case 'multiple_examination_question': comElementList.push(createElement('multipleExaminationQuestion', {props: {componentData: value, componentIndex: index}}, [])); 
        break;
        case 'multiple_radio_question': comElementList.push(createElement('multipleRadioQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        case 'name_location_question': comElementList.push(createElement('nameLocationQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        case 'open_question': comElementList.push(createElement('openQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        case 'compound_radio_question': comElementList.push(createElement('compoundRadioQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        case 'add_item_question': comElementList.push(createElement('addItemQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        case 'mark_star_question': comElementList.push(createElement('markStarQuestion', {props: {componentData: value, componentIndex: index}}, []));
        break;
        default: break;
      }
    })
    return createElement('div', {}, comElementList);
  }
}
</script>