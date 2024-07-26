package agiir.agenda.portlet;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import agiir.agenda.constants.AgiirAgendaPortletKeys;

import java.io.IOException;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author a.amara
 */
@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.agiir",
		"com.liferay.portlet.header-portlet-css=/css/index.css",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + AgiirAgendaPortletKeys.AgiirAgenda,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user",
		"com.liferay.portlet.footer-portlet-javascript=/js/dist/bundle.js"
	},
	service = Portlet.class
)
public class AgiirAgendaPortlet extends MVCPortlet {

	@Override
	public void doView(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		super.doView(renderRequest, renderResponse);
	}

}