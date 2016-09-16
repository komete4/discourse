import Step from 'wizard/models/step';
import WizardField from 'wizard/models/wizard-field';
import { ajax } from 'wizard/lib/ajax';
import computed from 'ember-addons/ember-computed-decorators';

const Wizard = Ember.Object.extend({
  @computed('steps.length')
  totalSteps: length => length,

  // A bit clunky, but get the current colors from the appropriate step
  getCurrentColors() {
    const colorStep = this.get('steps').findProperty('id', 'colors');
    if (!colorStep) { return; }

    const themeChoice = colorStep.get('fieldsById.theme_id');
    if (!themeChoice) { return; }

    const themeId = themeChoice.get('value');
    if (!themeId) { return; }

    const choices = themeChoice.get('choices');
    if (!choices) { return; }

    const option = choices.findProperty('id', themeId);
    if (!option) { return; }

    return option.data.colors;
  }

});

export function findWizard() {
  return ajax({ url: '/wizard.json' }).then(response => {
    const wizard = response.wizard;
    wizard.steps = wizard.steps.map(step => {
      const stepObj = Step.create(step);
      stepObj.fields = stepObj.fields.map(f => WizardField.create(f));
      return stepObj;
    });

    return Wizard.create(wizard);
  });
}