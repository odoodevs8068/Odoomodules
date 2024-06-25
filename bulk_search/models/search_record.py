
from odoo import api, fields, models
from odoo.exceptions import ValidationError


class SearchRecord(models.Model):
    _name = 'search.record'

    models = fields.Many2one('ir.model', string='Model', requires=True)
    name = fields.Char(related='models.name')
    model_name = fields.Char(related='models.model')

    @api.onchange('models')
    def onchange_check(self):
        if self.models:
            search_model = self.env['search.record'].search([('models', '=', self.models.id)], limit=1)
            if search_model:
                raise ValidationError(f"Model Already Exist!")


class ConfSetting(models.TransientModel):
    _inherit = "res.config.settings"

    def button_view_configure_search_record(self):
        return {
            'type': 'ir.actions.act_window',
            'name': f"Configure Search Model",
            'res_model': 'search.record',
            'view_mode': 'tree',
            'target': 'current'
        }

